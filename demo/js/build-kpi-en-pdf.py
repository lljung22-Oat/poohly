#!/usr/bin/env python3
"""Build the English working PDF of PA 2570 KPI explanations for international faculty."""
from pathlib import Path
from fpdf import FPDF

OUT = Path(__file__).resolve().parents[1] / "sources" / "PA-2570-KPI-guide-en.pdf"

PAGES = [
    (
        "Cover",
        [
            "Mahidol University",
            "Faculty of Social Sciences and Humanities",
            "",
            "PA 2570 KPI EXPLANATION",
            "Unit Performance Agreement (PA)",
            "Fiscal Year B.E. 2570 (2026-2027)",
            "",
            "English working edition for international faculty.",
            "The official booklet is in Thai. Counts in this booklet are unit-level",
            "indicators. Do not multiply university denominators by the 1,820",
            "individual faculty workload base.",
        ],
    ),
    (
        "Strategy 1 — World Class Research & Innovation",
        [
            "Number of International Publications (NOT a unit PA indicator)",
            "Unit: article   |   Collection year: FY 2570   |   Report: 4 times / year (quarterly)",
            "Count all international journal publications of the unit found in SciVal or Scopus.",
            "Count only records that appear in the database. The pull date must fall in the",
            "reporting fiscal year. Do not count the same article twice in the same KPI.",
            "Q1 method: pull 2026 data on 30 Sep 2026 as baseline; each later quarter pulls",
            "2026/2027 data and removes the baseline (and drops duplicate titles).",
            "Reporters: unit / Research Management Division. Compiler: Planning Division.",
            "Verifier: Research Management Division.",
            "",
            "1.1 Number of International Publications in Q1 Journal (unit PA)",
            "Unit: article   |   FY 2570   |   Quarterly",
            "Q1 means Quartile 1 by SJR in Scopus/SciVal. Count only Q1 items that appear",
            "in SciVal or Scopus in the reporting year. No duplicate article in the same KPI.",
            "Do not take units from this booklet for individual faculty scoring.",
            "",
            "1.2 Number of International Publications in Top 10 Journal (unit PA)",
            "Top 10 means Top 10 Percentile by SJR in Scopus/SciVal. Same SciVal/Scopus",
            "and no-duplicate rules as 1.1.",
            "",
            "1.3 Number of Publications with Academic-Corporate Collaboration (unit PA)",
            "Count international publications with a corporate co-author that appear in",
            "SciVal or Scopus. Same year-window and no-duplicate rules. Do not take units",
            "from this booklet for individual faculty scoring.",
        ],
    ),
    (
        "1.9 Research funding (amount stated in the contract)",
        [
            "1.9 Research support funds include project grants and other research support",
            "(equipment for research, publication support, etc.).",
            "",
            "1.9.1 External research funds — domestic (unit PA)",
            "Unit: baht   |   FY 2570   |   Quarterly",
            "Amount allocated to a researcher or project. Domestic external funders are",
            "Thai public, private, or non-profit bodies (e.g. foundations).",
            "Report the amount stated in the grant contract of the reporting year.",
            "The project must go through the Research Management Division.",
            "The university also asks for actual disbursement, but disbursement is NOT",
            "counted in the unit PA.",
            "Exclude: Fundamental Fund, contract-research funds, and clinical (CTA) funds.",
            "",
            "1.9.2 External research funds — international (unit PA)",
            "Same contract-amount rule. International public, private, or non-profit funders.",
            "Exclude contract-research funds and clinical (CTA) funds.",
            "Disbursement is reported but not counted in the unit PA.",
            "",
            "1.9.3 Clinical research funds — CTA, domestic and international (unit PA)",
            "Count the amount stated in the CTA contract. Both Thai and foreign CTA.",
            "Disbursement is not counted in the unit PA.",
            "The faculty announcement has no separate CTA scoring band; individual units",
            "still use the faculty grant-amount bands, not this booklet.",
        ],
    ),
    (
        "Strategy 2 — Education quality",
        [
            "2.1.1 Level 3 — interdisciplinary teaching or equivalent (unit PA)",
            "Unit: person   |   FY 2570",
            "Counts MUPSF level 3 and 4, and UKPSF Senior Fellow / Principal Fellow.",
            "",
            "2.1.2 Level 2 — teaching for a specific group or equivalent (unit PA)",
            "Counts MUPSF level 2 and UKPSF Fellow.",
            "",
            "2.2.1 Share of undergraduate programmes with international quality recognition (unit PA)",
            "Unit: percent. Booklet denominator = 79. Do not multiply by the 1,820 base.",
            "",
            "2.2.2 Share of graduate programmes with international quality recognition (unit PA)",
            "Unit: percent. Booklet denominator = 248.",
            "",
            "2.3 Share of undergraduate health-science programmes due for review that have",
            "international quality recognition (unit PA)",
            "Unit: percent. Booklet denominator = 26.",
            "",
            "2.16 Inbound / outbound students — Physical Mobility only (unit PA)",
            "Collection year: Academic Year 2569.",
            "2.16.1 inbound ≥ 12 weeks    2.16.2 inbound < 12 weeks",
            "2.16.3 outbound ≥ 12 weeks   2.16.4 outbound < 12 weeks",
            "Virtual mobility is not counted.",
        ],
    ),
    (
        "Strategy 3–4 — Policy, change agents, finance",
        [
            "3.1 Number of significant national and international social-guiding policies (unit PA)",
            "Unit: item   |   FY 2570",
            "Count only the reporting year. Do not accumulate from previous years.",
            "",
            "3.2 Number of Changemakers / Change Agents (unit PA)",
            "Unit: person. Committee decision is final. Publication alone does not count.",
            "",
            "4.4 Strategic Financial Management analysis report (unit PA)",
            "Unit: percent. The percent formula is not stated in the booklet.",
            "",
            "4.10.1 Efficiency of government-budget use at year end (unit PA)",
            "4.10.2 Efficiency of revenue-budget use at year end (unit PA)",
            "",
            "4.11.1.1 EBIDA positive — all funding sources",
            "4.11.1.2 EBIDA positive — excluding government revenue",
            "4.11.2 Net Income positive",
            "4.11.3 Net Profit Margin greater than 5 percent",
            "4.11.4 ROA greater than 5 percent",
            "",
            "4.12 Share of laboratories that use chemicals and have peer-evaluated safe-lab",
            "certification (unit PA). Denominator is not stated in the booklet.",
        ],
    ),
]


class Guide(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(22, 58, 95)
        self.cell(0, 8, "PA 2570 KPI Explanation  |  English working edition", ln=1)
        self.set_draw_color(22, 58, 95)
        self.line(16, 16, 194, 16)
        self.ln(2)

    def footer(self):
        self.set_y(-14)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(80, 80, 80)
        self.cell(0, 8, f"Page {self.page_no()}  |  Official Thai PDF remains the source of record", align="C")


def ascii(s):
    return (
        s.replace("\u2014", "-")
        .replace("\u2013", "-")
        .replace("\u2018", "'")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u2265", ">=")
        .replace("\u2264", "<=")
    )


def main():
    pdf = Guide()
    pdf.set_margins(18, 18, 18)
    pdf.set_auto_page_break(auto=True, margin=18)
    for i, (title, lines) in enumerate(PAGES):
        title = ascii(title)
        lines = [ascii(x) for x in lines]
        pdf.add_page()
        if i == 0:
            pdf.set_xy(18, 40)
            pdf.set_font("Helvetica", "B", 22)
            pdf.set_text_color(22, 58, 95)
            pdf.multi_cell(174, 10, "PA 2570 KPI EXPLANATION")  # noqa: E501
            pdf.ln(4)
            pdf.set_font("Helvetica", "", 13)
            for line in lines:
                pdf.set_x(18)
                pdf.multi_cell(174, 7, line or " ")
            continue
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(22, 58, 95)
        pdf.multi_cell(174, 8, title)
        pdf.ln(2)
        pdf.set_font("Helvetica", "", 11)
        pdf.set_text_color(26, 35, 50)
        for line in lines:
            pdf.set_x(18)
            if not line:
                pdf.ln(3)
            else:
                pdf.multi_cell(174, 6, line)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUT))
    print("wrote", OUT, "bytes", OUT.stat().st_size)


if __name__ == "__main__":
    main()
