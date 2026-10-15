import fs from "node:fs";
import path from "node:path";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import { config, projectRoot } from "./config.js";
import { can, isInTeam, menusFor, portalOf, roleLabel } from "./acl.js";
import { dispatchTable } from "./dispatchTable.js";
import {
  facultyUnitsFromAnnouncement,
  scaleLabel,
  scoreCc,
  weightsComplete,
  weightedTotal,
  SOURCE_MISSING,
} from "./formulas.js";
import {
  INDICATOR_KINDS,
  LOGIN_LOCK,
  RESULT_STEPS,
  STATUS_LABEL,
  WORKLOADS,
} from "./sourceRules.js";
import {
  acknowledge,
  agreementAfterAmend,
  agreementAfterDecision,
  ccFirstSubmit,
  ccHeadSave,
  ccSelfSubmit,
  disagree,
  facultySign,
  idpAck,
  idpDecide,
  idpDisagree,
  idpEvaluate,
  idpReport,
  idpSubmit,
  reviewCheck,
  rollupAgreementStatus,
  selfScoreSubmit,
} from "./state.js";
import {
  ensureRound,
  ensureSkeleton,
  getSet,
  getUser,
  getUserByUsername,
  listUsers,
  loadPa,
  publicUser,
  scoreAllowed,
} from "./store.js";

const jwtSecret = process.env.JWT_SECRET || "pa-dev-jwt-change-me";
const upload = multer({ dest: path.join(projectRoot, "server/uploads") });

function fail(status, error) {
  const err = new Error(error);
  err.status = status;
  return err;
}

async function actorMap(pool) {
  const rows = await listUsers(pool);
  return new Map(rows.map((row) => [row.id, row]));
}

export function createApp(pool) {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      backend: config.stack.backend.chosen,
      database: config.stack.database.engine,
    });
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const portal = req.body?.portal;
      const rule = LOGIN_LOCK[portal];
      if (!rule) throw fail(400, "ช่องทางเข้าสู่ระบบไม่รู้จัก");
      const year = String(req.body?.year || config.defaultYear);
      if (!config.years.includes(year)) throw fail(400, "ปีงบประมาณไม่อยู่ใน config");
      const username = String(req.body?.username || "").trim();
      const user = username ? await getUserByUsername(pool, username) : null;
      const generic = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
      if (!user || portalOf(user.role) !== portal) throw fail(401, generic);
      const failCol = portal === "ratee" ? "fail_ratee" : portal === "evaluator" ? "fail_eval" : "fail_admin";
      const lockCol = portal === "ratee" ? "lock_ratee_until" : portal === "evaluator" ? "lock_eval_until" : "lock_admin_until";
      if (user[lockCol] && new Date(user[lockCol]).getTime() > Date.now()) {
        throw fail(423, `รหัสผิดครบกำหนด ระงับตาม${rule.module}`);
      }
      const matched = await bcrypt.compare(String(req.body?.password || ""), user.password_hash);
      if (!matched) {
        const fails = Number(user[failCol]) + 1;
        const lockUntil = fails >= rule.maxFails ? new Date(Date.now() + rule.lockMinutes * 60 * 1000) : null;
        await pool.query(`UPDATE users SET ${failCol} = ?, ${lockCol} = ? WHERE id = ?`, [
          lockUntil ? 0 : fails,
          lockUntil,
          user.id,
        ]);
        throw fail(401, generic);
      }
      await pool.query(`UPDATE users SET ${failCol} = 0, ${lockCol} = NULL WHERE id = ?`, [user.id]);
      const token = jwt.sign(
        { sub: user.id, role: user.role, track: user.track, username: user.username },
        jwtSecret,
        { expiresIn: "8h" },
      );
      res.json({
        token,
        year,
        user: publicUser(user),
        roleLabel: roleLabel(user.role, config.labelMap),
      });
    } catch (error) {
      next(error);
    }
  });

  app.use("/api", async (req, res, next) => {
    if (req.path === "/health" || req.path === "/auth/login") return next();
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : "";
      if (!token) throw fail(401, "ต้องเข้าสู่ระบบ");
      const payload = jwt.verify(token, jwtSecret);
      const user = await getUser(pool, payload.sub);
      if (!user) throw fail(401, "ต้องเข้าสู่ระบบ");
      req.user = user;
      next();
    } catch (error) {
      if (!error.status) error.status = 401;
      next(error);
    }
  });

  app.get("/api/me", async (req, res, next) => {
    try {
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      if (req.user.track) await ensureSkeleton(pool, req.user.id, round.id);
      const pa = req.user.track ? await getSet(pool, req.user.id, round.id, "PA") : null;
      res.json({
        user: publicUser(req.user),
        roleLabel: roleLabel(req.user.role, config.labelMap),
        year,
        years: config.years,
        facultyName: config.facultyName,
        labelMap: config.labelMap,
        menus: menusFor(req.user, config, pa?.status === "approved" || isResult(pa?.status)),
        form11: config.form11,
        paReport: config.paReport,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/profile/:userId", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      res.json({ profile: publicUser(target) });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/profile/:userId", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      const self = req.user.id === target.id;
      if (self && !can(req.user, "editOwnProfile", target)) throw fail(403, "แก้โปรไฟล์นี้ไม่ได้");
      if (!self && !can(req.user, "editUnitProfile", target)) throw fail(403, "แก้โปรไฟล์นี้ไม่ได้");
      if (req.body?.facultyName && req.body.facultyName !== config.facultyName) {
        throw fail(400, "ห้ามเปลี่ยนชื่อส่วนงานจากตัวอย่างในไฟล์อื่น");
      }
      const fields = {
        full_name: req.body?.fullName,
        position_name: req.body?.position,
        staff_id: req.body?.staffId,
        person_type: req.body?.personType,
        department_name: req.body?.department,
        email: req.body?.email,
        start_date: req.body?.startDate || null,
      };
      await pool.query(
        `UPDATE users SET full_name=?, position_name=?, staff_id=?, person_type=?, department_name=?, email=?, start_date=? WHERE id=?`,
        [
          fields.full_name ?? target.full_name,
          fields.position_name ?? target.position_name,
          fields.staff_id ?? target.staff_id,
          fields.person_type ?? target.person_type,
          fields.department_name ?? target.department_name,
          fields.email ?? target.email,
          fields.start_date ?? target.start_date,
          target.id,
        ],
      );
      res.json({ profile: publicUser(await getUser(pool, target.id)) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/pa/:userId", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!target.track) throw fail(404, "บัญชีนี้ไม่มีชุด PA");
      const packed = await paPayload(target, await yearOf(req));
      if (!can(req.user, "viewScores", target)) packed.workloads = stripPaScores(packed.workloads);
      res.json(packed);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/pa/:userId", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "editPa", target)) throw fail(403, "แก้ข้อตกลงนี้ไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      await ensureSkeleton(pool, target.id, round.id);
      const paSet = await getSet(pool, target.id, round.id, "PA");
      if (isResult(paSet.status)) throw fail(409, "ส่งผลการดำเนินงานแล้ว แก้ข้อตกลงไม่ได้");
      const workloads = await loadPa(pool, target.id, round.id);
      for (const spec of WORKLOADS) {
        const incoming = (req.body?.workloads || []).find((row) => row.groupId === spec.id);
        if (!incoming) throw fail(400, "ต้องมีครบสี่ภาระงาน");
        const current = workloads.find((row) => row.group_id === spec.id);
        const locked = current.agreements.some((row) => row.status === "wait" || row.status === "approved");
        if (locked) continue;
        await pool.query("UPDATE workloads SET weight = ? WHERE id = ?", [emptyNumber(incoming.weight), current.id]);
        const agreementIds = current.agreements.map((row) => row.id);
        if (agreementIds.length) {
          await pool.query(`DELETE FROM indicators WHERE agreement_id IN (${agreementIds.map(() => "?").join(",")})`, agreementIds);
          await pool.query(`DELETE FROM agreements WHERE id IN (${agreementIds.map(() => "?").join(",")})`, agreementIds);
        }
        for (const agreement of incoming.agreements || []) {
          const [created] = await pool.query(
            "INSERT INTO agreements (workload_id, title, status) VALUES (?, ?, 'draft')",
            [current.id, agreement.title || null],
          );
          for (const indicator of agreement.indicators || []) {
            if (indicator.kind && !INDICATOR_KINDS.includes(indicator.kind)) throw fail(400, "ชนิดตัวชี้วัดไม่อยู่ในคู่มือ");
            const ref = indicator.indicatorRef || null;
            if (ref) {
              if (target.track !== "faculty" || spec.id !== "strat") throw fail(400, "อ้างอิงตัวชี้วัดได้เฉพาะภาระงานยุทธศาสตร์ฝั่งอาจารย์");
              const row = config.unitPaFy2570.catalog.find((item) => item.id === ref);
              if (!row || row.kind === "heading" || row.inUnitPa !== true) throw fail(400, "อ้างอิงได้เฉพาะตัวชี้วัดที่จัดทำ PA");
            }
            await pool.query(
              `INSERT INTO indicators (agreement_id, title, kind, weight, target_text, indicator_ref)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [created.insertId, indicator.title || null, indicator.kind || null, emptyNumber(indicator.weight), indicator.target || null, ref],
            );
          }
        }
      }
      res.json(await paPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/pa/:userId/submit", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "editPa", target)) throw fail(403, "ส่งข้อตกลงนี้ไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const workloads = await loadPa(pool, target.id, round.id);
      const weights = workloads.map((row) => row.weight);
      if (!weightsComplete(weights)) throw fail(400, "น้ำหนักภาระงานทั้งฉบับต้องรวม 100 จึงจะส่งได้ ฉบับร่างบันทึกไว้แล้ว");
      const agreements = workloads.flatMap((row) => row.agreements);
      if (agreements.length === 0) throw fail(400, "ยังไม่มีข้อตกลง");
      for (const agreement of agreements) {
        if (!weightsComplete(agreement.indicators.map((row) => row.weight))) {
          throw fail(400, "น้ำหนักตัวชี้วัดในแต่ละข้อตกลงต้องรวม 100");
        }
      }
      for (const agreement of agreements) {
        if (agreement.status === "draft" || agreement.status === "back") {
          await pool.query("UPDATE agreements SET status = 'wait', decision_reason = NULL WHERE id = ?", [agreement.id]);
        }
      }
      const fresh = await loadPa(pool, target.id, round.id);
      const status = rollupAgreementStatus(fresh.flatMap((row) => row.agreements.map((agreement) => agreement.status)));
      await pool.query("UPDATE evaluation_sets SET status = ? WHERE user_id = ? AND round_id = ? AND form_type = 'PA'", [
        status,
        target.id,
        round.id,
      ]);
      res.json(await paPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/pa/:userId/decide", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "approvePa", target)) throw fail(403, "อนุมัติข้อตกลงไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const workloads = await loadPa(pool, target.id, round.id);
      const agreements = workloads.flatMap((row) => row.agreements);
      const chosen = req.body?.all
        ? agreements.filter((row) => row.status === "wait")
        : agreements.filter((row) => row.id === Number(req.body?.agreementId));
      if (chosen.length === 0) throw fail(400, "ไม่มีรายการที่รออนุมัติ");
      for (const agreement of chosen) {
        const nextStatus = agreementAfterDecision(agreement.status, req.body?.decision, req.body?.reason);
        if (!nextStatus.ok) throw fail(400, nextStatus.error);
        await pool.query("UPDATE agreements SET status = ?, decision_reason = ? WHERE id = ?", [
          nextStatus.status,
          req.body?.decision === "reject" ? req.body.reason : null,
          agreement.id,
        ]);
      }
      const fresh = await loadPa(pool, target.id, round.id);
      const status = rollupAgreementStatus(fresh.flatMap((row) => row.agreements.map((agreement) => agreement.status)));
      await pool.query("UPDATE evaluation_sets SET status = ? WHERE user_id = ? AND round_id = ? AND form_type = 'PA'", [
        status,
        target.id,
        round.id,
      ]);
      res.json(await paPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/pa/:userId/amend", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "editPa", target)) throw fail(403, "แก้ไขข้อตกลงไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const paSet = await getSet(pool, target.id, round.id, "PA");
      const workloads = await loadPa(pool, target.id, round.id);
      const agreement = workloads.flatMap((row) => row.agreements).find((row) => row.id === Number(req.body?.agreementId));
      if (!agreement) throw fail(404, "ไม่พบข้อตกลง");
      const nextStatus = agreementAfterAmend(agreement.status, req.body?.confirm === true, paSet.status);
      if (!nextStatus.ok) throw fail(400, nextStatus.error);
      await pool.query("UPDATE agreements SET status = 'draft' WHERE id = ?", [agreement.id]);
      const fresh = await loadPa(pool, target.id, round.id);
      const status = rollupAgreementStatus(fresh.flatMap((row) => row.agreements.map((row) => row.status)));
      await pool.query("UPDATE evaluation_sets SET status = ? WHERE user_id = ? AND round_id = ? AND form_type = 'PA'", [
        status,
        target.id,
        round.id,
      ]);
      res.json(await paPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/pa/:userId/self-score", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "selfScore", target)) throw fail(403, "กรอกผลการดำเนินงานแทนไม่ได้");
      const year = await yearOf(req);
      const { round, indicators } = await indicatorRows(target.id, year);
      const paSet = await getSet(pool, target.id, round.id, "PA");
      if (indicators.some((row) => row.self_locked) || paSet.status === "reported") throw fail(409, "ส่งแล้วแก้ไม่ได้");
      if (paSet.status !== "approved") throw fail(400, "กรอกผลการดำเนินงานได้หลังข้อตกลงเห็นชอบ");
      for (const score of req.body?.scores || []) {
        if (!scoreAllowed(score.selfScore, config.paReport)) throw fail(400, "คะแนนตนเองต้องอยู่ในช่วง 0 ถึง 10");
        const row = indicators.find((item) => item.id === Number(score.indicatorId));
        if (!row) throw fail(400, "ไม่พบตัวชี้วัด");
        await pool.query("UPDATE indicators SET self_score = ? WHERE id = ?", [Number(score.selfScore), row.id]);
      }
      res.json(await paPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/pa/:userId/self-score/submit", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "selfScore", target)) throw fail(403, "ส่งผลการดำเนินงานไม่ได้");
      const year = await yearOf(req);
      const { round, indicators } = await indicatorRows(target.id, year);
      const paSet = await getSet(pool, target.id, round.id, "PA");
      const nextStatus = selfScoreSubmit(paSet.status, indicators.some((row) => row.self_locked));
      if (!nextStatus.ok) throw fail(400, nextStatus.error);
      if (indicators.length === 0 || indicators.some((row) => !scoreAllowed(row.self_score, config.paReport))) {
        throw fail(400, "ต้องมีคะแนนตนเองครบทุกตัวชี้วัด");
      }
      await pool.query(
        `UPDATE indicators SET self_locked = 1 WHERE agreement_id IN (${indicators.map(() => "?").join(",")})`,
        indicators.map((row) => row.agreement_id),
      );
      await pool.query("UPDATE evaluation_sets SET status = 'reported' WHERE id = ?", [paSet.id]);
      res.json(await paPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/pa/:userId/evidence", upload.single("file"), async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "selfScore", target)) throw fail(403, "แนบหลักฐานไม่ได้");
      const year = await yearOf(req);
      const { indicators } = await indicatorRows(target.id, year);
      const row = indicators.find((item) => item.id === Number(req.body?.indicatorId));
      if (!row || row.self_locked) throw fail(409, "แนบหลักฐานได้ก่อนส่งผลการดำเนินงาน");
      if (!req.file) throw fail(400, "ไม่มีไฟล์");
      await pool.query("UPDATE indicators SET evidence_name = ?, evidence_path = ? WHERE id = ?", [
        req.file.originalname,
        req.file.filename,
        row.id,
      ]);
      res.json({ evidenceName: req.file.originalname });
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/pa/:userId/head-score", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "scoreHead", target)) throw fail(403, "ให้คะแนน PA ไม่ได้");
      const year = await yearOf(req);
      const { round, indicators } = await indicatorRows(target.id, year);
      const paSet = await getSet(pool, target.id, round.id, "PA");
      if (!["reported", "head", "disagree"].includes(paSet.status)) throw fail(400, "ให้คะแนน PA ได้หลังผู้รับการประเมินส่งผล");
      if (indicators.some((row) => row.head_locked) && paSet.status !== "disagree") throw fail(409, "ส่งแล้วแก้ไม่ได้");
      for (const score of req.body?.scores || []) {
        if (!scoreAllowed(score.headScore, config.paReport)) throw fail(400, "คะแนนต้องอยู่ในช่วง 0 ถึง 10");
        const row = indicators.find((item) => item.id === Number(score.indicatorId));
        if (!row) throw fail(400, "ไม่พบตัวชี้วัด");
        await pool.query("UPDATE indicators SET head_score = ?, head_locked = 0 WHERE id = ?", [Number(score.headScore), row.id]);
      }
      res.json(await paPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/cc/:userId", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!target.track) throw fail(404, "ไม่มีชุดสมรรถนะ");
      const payload = await ccPayload(target, await yearOf(req));
      if (!can(req.user, "viewScores", target)) payload.items = payload.items.map(hideComp);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/cc/:userId", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!target.track) throw fail(404, "ไม่มีชุดสมรรถนะ");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      await ensureSkeleton(pool, target.id, round.id);
      const rows = await ccRows(target.id, round.id);
      const ccSet = await getSet(pool, target.id, round.id, "CC");
      const writer = scoreWriter(req.user, target, ccSet.status, rows);
      for (const score of req.body?.scores || []) {
        if (!scoreAllowed(score.score, config.paReport)) throw fail(400, "คะแนนสมรรถนะต้องอยู่ในช่วง 0 ถึง 10");
        const row = rows.find((item) => item.code === score.code);
        if (!row) throw fail(400, "ข้อสมรรถนะไม่ตรงกับ 7 ข้อของมหาวิทยาลัย");
        await pool.query(`UPDATE competency_scores SET ${writer.column} = ? WHERE id = ?`, [Number(score.score), row.id]);
      }
      res.json(await ccPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/cc/:userId/submit", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!target.track) throw fail(404, "ไม่มีชุดสมรรถนะ");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const rows = await ccRows(target.id, round.id);
      const ccSet = await getSet(pool, target.id, round.id, "CC");
      if (req.user.role === target.role && req.user.id === target.id) {
        const nextStatus = ccSelfSubmit(rows.some((row) => row.self_locked));
        if (!nextStatus.ok) throw fail(400, nextStatus.error);
        if (rows.some((row) => !scoreAllowed(row.self_score, config.paReport))) throw fail(400, "ต้องให้คะแนนครบ 7 ข้อ");
        await pool.query("UPDATE competency_scores SET self_locked = 1 WHERE user_id = ? AND round_id = ? AND competency_type = 'CC'", [
          target.id,
          round.id,
        ]);
        await pool.query("UPDATE evaluation_sets SET status = 'reported' WHERE id = ?", [ccSet.id]);
      } else if (req.user.role === "firstHead") {
        if (!can(req.user, "scoreFirst", target)) throw fail(403, "ส่งคะแนนไม่ได้");
        const nextStatus = ccFirstSubmit(ccSet.status, rows.every((row) => row.self_locked));
        if (!nextStatus.ok) throw fail(400, nextStatus.error);
        if (rows.some((row) => !scoreAllowed(row.first_score, config.paReport))) throw fail(400, "ต้องให้คะแนนครบ 7 ข้อ");
        await pool.query("UPDATE competency_scores SET first_locked = 1 WHERE user_id = ? AND round_id = ? AND competency_type = 'CC'", [
          target.id,
          round.id,
        ]);
        await pool.query("UPDATE evaluation_sets SET status = 'firstHead' WHERE id = ?", [ccSet.id]);
      } else {
        throw fail(403, "ส่งคะแนนขั้นนี้ไม่ได้");
      }
      res.json(await ccPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/review/:userId/check", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "scoreHead", target)) throw fail(403, "ตรวจคะแนนไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const paSet = await getSet(pool, target.id, round.id, "PA");
      const ccSet = await getSet(pool, target.id, round.id, "CC");
      const { indicators } = await indicatorRows(target.id, year);
      const rows = await ccRows(target.id, round.id);
      const nextStatus = reviewCheck({
        paStatus: paSet.status,
        ccStatus: ccSet.status,
        paSelfLocked: indicators.length > 0 && indicators.every((row) => row.self_locked),
        ccHeadReady: rows.every((row) => scoreAllowed(row.head_score, config.paReport)) && rows.every((row) => row.first_locked),
        facultySigned: Boolean(paSet.faculty_signed),
      });
      if (!nextStatus.ok) throw fail(400, nextStatus.error);
      if (indicators.some((row) => !scoreAllowed(row.head_score, config.paReport))) {
        throw fail(400, "ต้องมีคะแนน PA ของหัวหน้างานครบ");
      }
      await pool.query("UPDATE indicators SET head_locked = 1 WHERE id IN (" + indicators.map(() => "?").join(",") + ")", indicators.map((row) => row.id));
      await pool.query("UPDATE competency_scores SET head_locked = 1 WHERE user_id = ? AND round_id = ? AND competency_type = 'CC'", [
        target.id,
        round.id,
      ]);
      await pool.query("UPDATE evaluation_sets SET status = 'head', faculty_signed = 0, disagree_reason = NULL WHERE user_id = ? AND round_id = ? AND form_type IN ('PA','CC')", [
        target.id,
        round.id,
      ]);
      await pool.query(
        "UPDATE score_reviews SET strengths = ?, improvements = ?, suggestions = ?, checked_at = NOW() WHERE user_id = ? AND round_id = ?",
        [req.body?.strengths || null, req.body?.improvements || null, req.body?.suggestions || null, target.id, round.id],
      );
      res.json({ pa: await paPayload(target, year), cc: await ccPayload(target, year) });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/review/:userId/sign", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "signFaculty", target)) throw fail(403, "ลงนามไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const paSet = await getSet(pool, target.id, round.id, "PA");
      const nextStatus = facultySign(paSet.status);
      if (!nextStatus.ok) throw fail(400, nextStatus.error);
      await pool.query("UPDATE evaluation_sets SET faculty_signed = 1 WHERE user_id = ? AND round_id = ? AND form_type IN ('PA','CC')", [
        target.id,
        round.id,
      ]);
      res.json({ signed: true, label: config.labelMap.facultySign });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/review/:userId/ack", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "ack", target)) throw fail(403, "รับทราบไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const paSet = await getSet(pool, target.id, round.id, "PA");
      const ccSet = await getSet(pool, target.id, round.id, "CC");
      const nextStatus = acknowledge({
        paStatus: paSet.status,
        ccStatus: ccSet.status,
        paSigned: Boolean(paSet.faculty_signed),
        ccSigned: Boolean(ccSet.faculty_signed),
      });
      if (!nextStatus.ok) throw fail(400, nextStatus.error);
      await pool.query("UPDATE evaluation_sets SET status = 'ack' WHERE user_id = ? AND round_id = ? AND form_type IN ('PA','CC')", [
        target.id,
        round.id,
      ]);
      res.json({ paStatus: "ack", ccStatus: "ack" });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/review/:userId/disagree", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "disagree", target)) throw fail(403, "ไม่เห็นด้วยไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const paSet = await getSet(pool, target.id, round.id, "PA");
      const ccSet = await getSet(pool, target.id, round.id, "CC");
      const nextStatus = disagree({
        paStatus: paSet.status,
        ccStatus: ccSet.status,
        paSigned: Boolean(paSet.faculty_signed),
        ccSigned: Boolean(ccSet.faculty_signed),
        reason: req.body?.reason,
      });
      if (!nextStatus.ok) throw fail(400, nextStatus.error);
      await pool.query(
        "UPDATE evaluation_sets SET status = 'disagree', faculty_signed = 0, disagree_reason = ? WHERE user_id = ? AND round_id = ? AND form_type IN ('PA','CC')",
        [req.body.reason, target.id, round.id],
      );
      await pool.query(
        `UPDATE indicators i JOIN agreements a ON a.id = i.agreement_id JOIN workloads w ON w.id = a.workload_id
         SET i.head_locked = 0 WHERE w.user_id = ? AND w.round_id = ?`,
        [target.id, round.id],
      );
      await pool.query("UPDATE competency_scores SET head_locked = 0 WHERE user_id = ? AND round_id = ? AND competency_type = 'CC'", [
        target.id,
        round.id,
      ]);
      res.json({ paStatus: "disagree", ccStatus: "disagree" });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/idp/:userId", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!target.track) throw fail(404, "ไม่มีชุดแผนพัฒนา");
      res.json(await idpPayload(target, await yearOf(req)));
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/idp/:userId", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "idpEdit", target)) throw fail(403, "แก้แผนพัฒนาไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      await ensureSkeleton(pool, target.id, round.id);
      const current = await idpRows(target.id, round.id);
      const incoming = req.body?.items || [];
      const keep = new Set();
      for (const item of incoming) {
        if (item.method && !config.idp.methods.includes(String(item.method))) throw fail(400, "วิธีพัฒนาต้องเป็น 70 20 หรือ 10");
        const budget = item.budget === null || item.budget === undefined || item.budget === "" ? 0 : Number(item.budget);
        if (item.id) {
          const found = current.find((row) => row.id === Number(item.id));
          if (!found) throw fail(400, "ไม่พบรายการแผน");
          if (found.status !== "draft" && found.status !== "back") {
            keep.add(found.id);
            continue;
          }
          await pool.query("UPDATE idp_items SET title = ?, method = ?, budget = ? WHERE id = ?", [
            item.title || null,
            item.method ? String(item.method) : null,
            budget,
            found.id,
          ]);
          keep.add(found.id);
        } else {
          const [created] = await pool.query(
            "INSERT INTO idp_items (user_id, round_id, title, method, budget, status) VALUES (?, ?, ?, ?, ?, 'draft')",
            [target.id, round.id, item.title || null, item.method ? String(item.method) : null, budget],
          );
          keep.add(created.insertId);
        }
      }
      for (const row of current) {
        if (!keep.has(row.id) && (row.status === "draft" || row.status === "back")) {
          await pool.query("DELETE FROM idp_items WHERE id = ?", [row.id]);
        }
      }
      const payload = await idpPayload(target, year);
      payload.hint = payload.items.length > config.idp.maxItemsHint && !config.idp.hardBlockOverMax
        ? "ไม่ควรเกิน 1–2 รายการต่อปี"
        : null;
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/idp/:userId/submit", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "idpEdit", target)) throw fail(403, "ส่งแผนไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const rows = await idpRows(target.id, round.id);
      if (rows.length === 0) throw fail(400, "ยังไม่มีรายการแผน");
      for (const row of rows) {
        if (row.status !== "draft" && row.status !== "back") continue;
        if (!row.title || !config.idp.methods.includes(row.method)) throw fail(400, "รายการแผนต้องมีชื่อและวิธี 70 20 หรือ 10");
        const nextStatus = idpSubmit(row.status);
        if (!nextStatus.ok) throw fail(400, nextStatus.error);
        await pool.query("UPDATE idp_items SET status = 'idpWait' WHERE id = ?", [row.id]);
      }
      res.json(await idpPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/idp/:userId/decide", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "idpDecide", target)) throw fail(403, "อนุมัติแผนไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const rows = await idpRows(target.id, round.id);
      const chosen = req.body?.all ? rows.filter((row) => row.status === "idpWait") : rows.filter((row) => row.id === Number(req.body?.itemId));
      if (chosen.length === 0) throw fail(400, "ไม่มีแผนที่รออนุมัติ");
      for (const row of chosen) {
        const nextStatus = idpDecide(row.status, req.body?.decision, req.body?.reason);
        if (!nextStatus.ok) throw fail(400, nextStatus.error);
        await pool.query("UPDATE idp_items SET status = ?, decision_reason = ? WHERE id = ?", [
          nextStatus.status,
          req.body?.decision === "reject" ? req.body.reason : null,
          row.id,
        ]);
      }
      res.json(await idpPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/idp/:userId/report", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "idpReport", target)) throw fail(403, "รายงานแผนไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const row = (await idpRows(target.id, round.id)).find((item) => item.id === Number(req.body?.itemId));
      if (!row) throw fail(404, "ไม่พบรายการแผน");
      const nextStatus = idpReport(row.status, Boolean(row.report_locked));
      if (!nextStatus.ok) throw fail(400, nextStatus.error);
      await pool.query("UPDATE idp_items SET report_text = ?, status = 'idpReported', report_locked = 1 WHERE id = ?", [
        req.body?.report || null,
        row.id,
      ]);
      res.json(await idpPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/idp/:userId/evaluate", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "idpEvaluate", target)) throw fail(403, "ประเมินแผนไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const row = (await idpRows(target.id, round.id)).find((item) => item.id === Number(req.body?.itemId));
      if (!row) throw fail(404, "ไม่พบรายการแผน");
      const nextStatus = idpEvaluate(row.status, req.body?.result, config.idp.resultLabels);
      if (!nextStatus.ok) throw fail(400, nextStatus.error);
      await pool.query("UPDATE idp_items SET result_label = ?, status = 'idpEval' WHERE id = ?", [req.body.result, row.id]);
      res.json(await idpPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/idp/:userId/ack", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "ack", target)) throw fail(403, "รับทราบแผนไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const row = (await idpRows(target.id, round.id)).find((item) => item.id === Number(req.body?.itemId));
      if (!row) throw fail(404, "ไม่พบรายการแผน");
      const nextStatus = idpAck(row.status);
      if (!nextStatus.ok) throw fail(400, nextStatus.error);
      await pool.query("UPDATE idp_items SET status = 'idpAck' WHERE id = ?", [row.id]);
      res.json(await idpPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/idp/:userId/disagree", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "disagree", target)) throw fail(403, "ไม่เห็นด้วยไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const row = (await idpRows(target.id, round.id)).find((item) => item.id === Number(req.body?.itemId));
      if (!row) throw fail(404, "ไม่พบรายการแผน");
      const nextStatus = idpDisagree(row.status, req.body?.reason);
      if (!nextStatus.ok) throw fail(400, nextStatus.error);
      await pool.query("UPDATE idp_items SET status = 'disagree', decision_reason = ? WHERE id = ?", [req.body.reason, row.id]);
      res.json(await idpPayload(target, year));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/research/:userId/:sheet", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "research", target)) throw fail(403, "แบบนี้ไม่เปิดในสายนี้");
      const year = await yearOf(req);
      res.json(await researchPayload(target, year, req.params.sheet));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/research/:userId/:sheet", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "researchWrite", target)) throw fail(403, "บันทึกแบบโครงการวิจัยไม่ได้");
      const sheet = sheetOf(req.params.sheet);
      const clean = pickColumns(req.body, sheet.columns);
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      if (sheet.name === "iNT") {
        await pool.query(
          `INSERT INTO research_int
            (user_id, round_id, status_text, row_no, project_name, leader, affiliation, fund_name, start_text, end_text, amount_text, objective, benefit, output_text, contract_no)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [target.id, round.id, clean["สถานะ"], clean["ที่"], clean["ชื่อโครงการ"], clean["หัวหน้าโครงการ"], clean["สังกัด"], clean["ชื่อแหล่งทุน"], clean["ระยะเวลาเริ่มโครงการ"], clean["ระยะเวลาสิ้นสุดโครงการ"], clean["จำนวนเงินตลอดโครงการ"], clean["วัตถุประสงค์"], clean["ประโยชน์ของโครงการ"], clean["ผลผลิต (output)"], clean["สัญญาเลขที่"]],
        );
      } else {
        await pool.query(
          `INSERT INTO research_notice (user_id, round_id, row_no, project_name, leader, affiliation, remark)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [target.id, round.id, clean["ที่"], clean["ชื่อโครงการ"], clean["หัวหน้าโครงการ"], clean["สังกัด"], clean["หมายเหตุ"]],
        );
      }
      res.json(await researchPayload(target, year, sheet.name));
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/research/:userId/:sheet/:rowId", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "researchWrite", target)) throw fail(403, "ลบแบบโครงการวิจัยไม่ได้");
      const sheet = sheetOf(req.params.sheet);
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const table = sheet.name === "iNT" ? "research_int" : "research_notice";
      await pool.query(`DELETE FROM ${table} WHERE id = ? AND user_id = ? AND round_id = ?`, [Number(req.params.rowId), target.id, round.id]);
      res.json(await researchPayload(target, year, sheet.name));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/indicators", async (req, res, next) => {
    try {
      if (!can(req.user, "indicators", req.user)) throw fail(403, "บัญชีตัวชี้วัดนี้ไม่เปิดในสายสนับสนุน");
      res.json({
        layer: config.unitPaFy2570.layer,
        usedOnTrack: config.unitPaFy2570.usedOnTrack,
        sourceSaysUnitPa: config.unitPaFy2570.sourceSaysUnitPa,
        doNotMergeIntoIndividualShpa: config.unitPaFy2570.doNotMergeIntoIndividualShpa,
        sourceFile: config.unitPaFy2570.sourceFile,
        title: config.unitPaFy2570.title,
        contact: config.unitPaFy2570.contact,
        publicationPull: config.unitPaFy2570.publicationPull,
        catalog: config.unitPaFy2570.catalog,
        facultyUnitLink: facultyUnitsFromAnnouncement(),
        note: "ตัวหารและสูตรในเล่มนี้ไม่ถูกนำไปคูณฐานหน่วยอาจารย์",
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/staff-form/:userId/:form", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (req.params.form === "form11" || config.form11.enabled === false && req.params.form === "11") {
        throw fail(404, "แบบคำมั่นไม่เปิดเมนู");
      }
      if (!["form05", "form06", "form07", "form08", "form09"].includes(req.params.form)) throw fail(404, "ไม่มีแบบนี้");
      if (!can(req.user, "staffForm", target)) throw fail(403, "สายวิชาการไม่เปิดแบบ 05 ถึง 09");
      if (req.params.form === "form06") {
        const year = await yearOf(req);
        const round = await ensureRound(pool, year);
        const paSet = await getSet(pool, target.id, round.id, "PA");
        if (!paSet || !["approved", "reported", "firstHead", "head", "ack", "disagree"].includes(paSet.status)) {
          throw fail(403, "แบบ 06 เปิดเมื่อข้อตกลงอนุมัติ");
        }
      }
      res.json({
        form: req.params.form,
        source: config.staffFormFields[req.params.form],
        rubrics: config.staffRubrics,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/report/:userId", async (req, res, next) => {
    try {
      const target = await targetOf(req);
      if (!can(req.user, "viewScores", target)) throw fail(403, "ซ่อนการให้คะแนน");
      const year = await yearOf(req);
      const pa = target.track ? await paPayload(target, year) : null;
      const cc = target.track ? await ccPayload(target, year) : null;
      const round = await ensureRound(pool, year);
      const review = target.track
        ? await pool.query("SELECT strengths, improvements, suggestions FROM score_reviews WHERE user_id = ? AND round_id = ?", [target.id, round.id]).then(([rows]) => rows[0] || null)
        : null;
      const ccScore = cc?.summary?.C ?? null;
      const total = weightedTotal(SOURCE_MISSING, ccScore, config.weights);
      res.json({
        title: "รายงานและติดตามผลการดำเนินการ (REPORT)",
        profile: publicUser(target),
        year,
        labelMap: config.labelMap,
        weights: config.weights,
        pa,
        cc,
        review,
        longNarrative: config.paReport.allowLongNarrative,
        weightedTotal: total,
        level: SOURCE_MISSING,
        levelReason: "ไม่มีสูตรแปลงคะแนน 0–10 เป็น paScore ในเอกสาร",
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/calendar", async (req, res, next) => {
    try {
      if (!can(req.user, "viewCalendar", req.user)) throw fail(403, "เปิดปฏิทินไม่ได้");
      const rounds = [];
      for (const year of config.years) rounds.push(await ensureRound(pool, year));
      res.json({
        rounds,
        employmentRule: "ข้าราชการหรือลูกจ้าง 2 รอบต่อปี พนักงานมหาวิทยาลัยหรือสมทบ 1 รอบ",
        personType: SOURCE_MISSING,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/people", async (req, res, next) => {
    try {
      if (req.user.role !== "hr" && req.user.role !== "admin" && req.user.role !== "firstHead" && req.user.role !== "head") {
        throw fail(403, "ดูรายชื่อนี้ไม่ได้");
      }
      const map = await actorMap(pool);
      const rows = [...map.values()].filter((row) => isInTeam(req.user, row, map) && row.id !== req.user.id);
      const visible = req.user.role === "firstHead" || req.user.role === "head"
        ? rows.filter((row) => row.track)
        : rows;
      res.json({ people: visible.map(publicUser) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/sets", async (req, res, next) => {
    try {
      if (req.user.role !== "hr") throw fail(403, "ตรวจชุดประเมินไม่ได้");
      const year = await yearOf(req);
      const round = await ensureRound(pool, year);
      const people = (await listUsers(pool)).filter((row) => row.track && row.faculty_name === req.user.faculty_name);
      const sets = [];
      for (const person of people) {
        await ensureSkeleton(pool, person.id, round.id);
        const forms = await pool.query("SELECT form_type, status, enabled FROM evaluation_sets WHERE user_id = ? AND round_id = ?", [person.id, round.id]);
        sets.push({ profile: publicUser(person), forms: forms[0] });
      }
      res.json({
        sets,
        fc: config.staffRubrics,
        note: "FC และ MC ยัง SOURCE_MISSING จึงเปิดใช้ไม่ได้จนกว่าจะมีรายการสมรรถนะตามตำแหน่ง",
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/users", async (req, res, next) => {
    try {
      if (!can(req.user, "manageAccounts", req.user)) throw fail(403, "สร้างบัญชีไม่ได้");
      const role = req.body?.role;
      if (!config.roles.includes(role)) throw fail(400, "บทบาทไม่อยู่ใน config");
      let track = null;
      if (role === "faculty") track = "faculty";
      else if (role === "support") track = "support";
      if (!req.body?.username || !req.body?.password || !req.body?.fullName) throw fail(400, "ต้องมีชื่อผู้ใช้ รหัสผ่าน และชื่อ");
      const password = await bcrypt.hash(String(req.body.password), 10);
      await pool.query(
        `INSERT INTO users (username, password_hash, role, track, full_name, position_name, staff_id, faculty_name, supervisor_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          String(req.body.username).trim(),
          password,
          role,
          track,
          req.body.fullName,
          req.body.position || null,
          req.body.staffId || null,
          config.facultyName,
          req.body.supervisorId || null,
        ],
      );
      res.json({ user: publicUser(await getUserByUsername(pool, String(req.body.username).trim())) });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/admin/users/:userId/supervisor", async (req, res, next) => {
    try {
      if (!can(req.user, "manageAccounts", req.user)) throw fail(403, "กำหนดผู้บังคับบัญชาไม่ได้");
      await pool.query("UPDATE users SET supervisor_id = ? WHERE id = ?", [req.body?.supervisorId || null, Number(req.params.userId)]);
      res.json({ profile: publicUser(await getUser(pool, Number(req.params.userId))) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/dispatch", (req, res, next) => {
    try {
      if (!can(req.user, "dispatch", req.user)) throw fail(403, "รายการซองนี้ไม่ใช่หน้าผู้รับการประเมิน");
      res.json(dispatchTable);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/help", (req, res) => {
    res.json({
      role: req.user.role,
      lines: helpLines(req.user.role),
    });
  });

  const dist = path.join(projectRoot, "client/dist");
  if (fs.existsSync(dist)) {
    app.use(express.static(dist));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(dist, "index.html"));
    });
  }

  app.use((error, _req, res, _next) => {
    const status = error.status || 500;
    if (status === 500) console.error(error);
    res.status(status).json({ error: status === 500 ? "ระบบขัดข้อง" : error.message });
  });

  return app;

  async function yearOf(req) {
    const year = String(req.query.year || req.body?.year || config.defaultYear);
    if (!config.years.includes(year)) throw fail(400, "ปีงบประมาณไม่อยู่ใน config");
    return year;
  }

  async function targetOf(req) {
    const id = req.params.userId === "me" ? req.user.id : Number(req.params.userId);
    const target = await getUser(pool, id);
    if (!target) throw fail(404, "ไม่พบบุคคล");
    const map = await actorMap(pool);
    if (!isInTeam(req.user, target, map)) throw fail(403, "ไม่อยู่ในความดูแล");
    return target;
  }

  async function paPayload(target, year) {
    const round = await ensureRound(pool, year);
    await ensureSkeleton(pool, target.id, round.id);
    const workloads = await loadPa(pool, target.id, round.id);
    const paSet = await getSet(pool, target.id, round.id, "PA");
    const tree = workloads.map((workload) => ({
      id: workload.id,
      groupId: workload.group_id,
      groupNo: workload.group_no,
      title: workload.title,
      weight: workload.weight,
      cap: target.track === "faculty" ? config.faculty.groups.find((group) => group.id === workload.group_id) : null,
      agreements: workload.agreements.map((agreement) => ({
        id: agreement.id,
        title: agreement.title,
        status: agreement.status,
        statusLabel: STATUS_LABEL[agreement.status],
        reason: agreement.decision_reason,
        indicators: agreement.indicators.map((indicator) => ({
          id: indicator.id,
          title: indicator.title,
          kind: indicator.kind,
          weight: indicator.weight,
          target: indicator.target_text,
          indicatorRef: indicator.indicator_ref,
          selfScore: indicator.self_score,
          selfLabel: scaleLabel(indicator.self_score, config.scale5),
          headScore: indicator.head_score,
          headLabel: scaleLabel(indicator.head_score, config.scale5),
          selfLocked: Boolean(indicator.self_locked),
          evidenceName: indicator.evidence_name,
        })),
      })),
    }));
    return {
      year,
      status: paSet.status,
      statusLabel: STATUS_LABEL[paSet.status],
      facultySigned: Boolean(paSet.faculty_signed),
      disagreeReason: paSet.disagree_reason,
      steps: RESULT_STEPS,
      mode: config.paReport.mode,
      allowLongNarrative: config.paReport.allowLongNarrative,
      kinds: INDICATOR_KINDS,
      shpaColumns: target.track === "faculty" ? SOURCE_MISSING : null,
      announcementUnits: target.track === "faculty" ? facultyUnitsFromAnnouncement() : null,
      totalUnits: target.track === "faculty" ? config.faculty.totalUnits : null,
      workloads: tree,
      staffForms: target.track === "support" ? config.staffFormFields : null,
    };
  }

  async function indicatorRows(userId, year) {
    const round = await ensureRound(pool, year);
    const workloads = await loadPa(pool, userId, round.id);
    const indicators = workloads.flatMap((workload) => workload.agreements.flatMap((agreement) => agreement.indicators));
    return { round, indicators };
  }

  async function ccRows(userId, roundId) {
    const [rows] = await pool.query(
      "SELECT * FROM competency_scores WHERE user_id = ? AND round_id = ? AND competency_type = 'CC' ORDER BY id",
      [userId, roundId],
    );
    return rows;
  }

  async function ccPayload(target, year) {
    const round = await ensureRound(pool, year);
    await ensureSkeleton(pool, target.id, round.id);
    const rows = await ccRows(target.id, round.id);
    const ccSet = await getSet(pool, target.id, round.id, "CC");
    const chosen = rows.every((row) => row.head_score !== null)
      ? rows.map((row) => Number(row.head_score))
      : null;
    const summary = chosen ? scoreCc(chosen) : null;
    return {
      year,
      status: ccSet.status,
      statusLabel: STATUS_LABEL[ccSet.status],
      facultySigned: Boolean(ccSet.faculty_signed),
      disagreeReason: ccSet.disagree_reason,
      count: config.cc.count,
      items: rows.map((row) => ({
        code: row.code,
        name: row.name,
        selfScore: row.self_score,
        firstScore: row.first_score,
        headScore: row.head_score,
        selfLocked: Boolean(row.self_locked),
        firstLocked: Boolean(row.first_locked),
        headLocked: Boolean(row.head_locked),
      })),
      summary,
      weights: config.weights,
    };
  }

  function scoreWriter(actor, target, status, rows) {
    if (actor.id === target.id && can(actor, "scoreSelf", target)) {
      if (rows.some((row) => row.self_locked)) throw fail(409, "ยกเลิกประเมินตนเองไม่ได้");
      return { column: "self_score" };
    }
    if (actor.role === "firstHead" && can(actor, "scoreFirst", target)) {
      if (!rows.every((row) => row.self_locked) || status !== "reported") throw fail(400, "ให้คะแนนได้หลังผู้รับการประเมินส่งสมรรถนะ");
      if (rows.some((row) => row.first_locked)) throw fail(409, "ส่งแล้วแก้ไม่ได้");
      return { column: "first_score" };
    }
    if (actor.role === "head" && can(actor, "scoreHead", target)) {
      const gate = ccHeadSave(status);
      if (!gate.ok) throw fail(400, gate.error);
      if (rows.some((row) => row.head_locked) && status !== "disagree") throw fail(409, "ส่งแล้วแก้ไม่ได้");
      return { column: "head_score" };
    }
    throw fail(403, "ให้คะแนนสมรรถนะขั้นนี้ไม่ได้");
  }

  async function idpRows(userId, roundId) {
    const [rows] = await pool.query("SELECT * FROM idp_items WHERE user_id = ? AND round_id = ? ORDER BY id", [userId, roundId]);
    return rows;
  }

  async function idpPayload(target, year) {
    const round = await ensureRound(pool, year);
    await ensureSkeleton(pool, target.id, round.id);
    const rows = await idpRows(target.id, round.id);
    return {
      year,
      maxItemsHint: config.idp.maxItemsHint,
      hardBlockOverMax: config.idp.hardBlockOverMax,
      methods: config.idp.methods,
      resultLabels: config.idp.resultLabels,
      items: rows.map((row) => ({
        id: row.id,
        title: row.title,
        method: row.method,
        budget: row.budget,
        report: row.report_text,
        result: row.result_label,
        status: row.status,
        statusLabel: STATUS_LABEL[row.status],
        reportLocked: Boolean(row.report_locked),
        reason: row.decision_reason,
      })),
    };
  }

  function sheetOf(name) {
    const sheets = config.facultyResearchTracking2570.sheets;
    if (!sheets[name]) throw fail(404, "ไม่มีชีตนี้");
    return { name, columns: sheets[name].columns };
  }

  function pickColumns(body, columns) {
    const clean = {};
    for (const key of Object.keys(body || {})) {
      if (!columns.includes(key)) throw fail(400, "ห้ามเพิ่มคอลัมน์ที่ไม่มีในไฟล์");
    }
    for (const key of columns) {
      const value = body?.[key];
      clean[key] = value === undefined || value === null || value === "" ? null : String(value);
    }
    return clean;
  }

  async function researchPayload(target, year, sheetName) {
    const sheet = sheetOf(sheetName);
    const round = await ensureRound(pool, year);
    if (sheet.name === "iNT") {
      const [rows] = await pool.query("SELECT * FROM research_int WHERE user_id = ? AND round_id = ? ORDER BY id", [target.id, round.id]);
      return {
        sheet: sheet.name,
        columns: sheet.columns,
        knownStatus: config.facultyResearchTracking2570.sheets.iNT.statusValuesFound,
        otherStatuses: SOURCE_MISSING,
        rows: rows.map(intRow),
      };
    }
    const [rows] = await pool.query("SELECT * FROM research_notice WHERE user_id = ? AND round_id = ? ORDER BY id", [target.id, round.id]);
    return {
      sheet: sheet.name,
      columns: sheet.columns,
      knownRemark: config.facultyResearchTracking2570.sheets["แจ้งทำวิจัย"].remarkValuesFound,
      otherRemarks: SOURCE_MISSING,
      rows: rows.map(noticeRow),
    };
  }
}

function intRow(row) {
  return {
    id: row.id,
    สถานะ: row.status_text,
    ที่: row.row_no,
    ชื่อโครงการ: row.project_name,
    หัวหน้าโครงการ: row.leader,
    สังกัด: row.affiliation,
    ชื่อแหล่งทุน: row.fund_name,
    ระยะเวลาเริ่มโครงการ: row.start_text,
    ระยะเวลาสิ้นสุดโครงการ: row.end_text,
    จำนวนเงินตลอดโครงการ: row.amount_text,
    วัตถุประสงค์: row.objective,
    ประโยชน์ของโครงการ: row.benefit,
    "ผลผลิต (output)": row.output_text,
    สัญญาเลขที่: row.contract_no,
  };
}

function noticeRow(row) {
  return {
    id: row.id,
    ที่: row.row_no,
    ชื่อโครงการ: row.project_name,
    หัวหน้าโครงการ: row.leader,
    สังกัด: row.affiliation,
    หมายเหตุ: row.remark,
  };
}

function isResult(status) {
  return ["reported", "firstHead", "head", "ack", "disagree"].includes(status);
}

function emptyNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  return Number(value);
}

function stripPaScores(workloads) {
  return workloads.map((workload) => ({
    ...workload,
    agreements: workload.agreements.map((agreement) => ({
      ...agreement,
      indicators: agreement.indicators.map((indicator) => ({
        ...indicator,
        selfScore: null,
        headScore: null,
        selfLabel: null,
        headLabel: null,
      })),
    })),
  }));
}

function hideComp(item) {
  return { ...item, selfScore: null, firstScore: null, headScore: null };
}

function helpLines(role) {
  const common = [
    "เข้าคนละช่องทาง ไม่มีปุ่มสลับบทบาทในหน้าผู้รับการประเมิน",
    "ป้ายผู้ประเมินคือหัวหน้างานขั้นต้น และหัวหน้างาน",
    "ปีงบประมาณที่เปิดคือ 2569 และ 2570",
  ];
  if (role === "faculty") {
    return [
      ...common,
      "สายวิชาการใช้สี่ภาระงานของ PMS และเห็นเพดานหน่วยจากประกาศเท่าที่ config มี",
      "ตารางคะแนนบทความและคอลัมน์ SHPA ยัง SOURCE_MISSING",
      "แบบติดตามข้อมูลโครงการวิจัย ปี 2570 คนละแบบกับแบบ 06",
      "คำอธิบายตัวชี้วัด PA 2570 เป็นบัญชีอ่านประกอบ ไม่นำไปคูณฐาน 1820",
    ];
  }
  if (role === "support") {
    return [
      ...common,
      "แบบ 05 ถึง 09 ยัง SOURCE_MISSING จึงไม่สร้างช่องเอง",
      "ผลการดำเนินงานเป็นตัวเลข 0–10 ไม่มีรายงานยาว",
    ];
  }
  if (role === "firstHead") return [...common, "ให้คะแนนสมรรถนะแล้วส่งหัวหน้างาน ไม่กรอกผลการดำเนินงานแทน"];
  if (role === "head") return [...common, "อนุมัติข้อตกลงทีละข้อหรือทั้งหมด ตรวจคะแนนเมื่อ PA และ CC ครบทั้งคู่"];
  if (role === "hr") return [...common, "วันในปฏิทินยัง SOURCE_MISSING", "FC และ MC ยังเปิดไม่ได้เพราะไม่มีรายการสมรรถนะตามตำแหน่ง"];
  return [...common, "สร้างบัญชีและกำหนดผู้บังคับบัญชา ไม่กรอกคะแนนแทน"];
}
