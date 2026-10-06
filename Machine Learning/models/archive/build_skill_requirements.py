from pathlib import Path
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent

WORKBOOK = BASE_DIR / "Claudia's Datasets Updated Academic Model.xlsx"

OUTPUT = BASE_DIR / "Career Skill Requirements.xlsx"


LEVELS = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
    4: "Expert",
}


def clean(value):
    if pd.isna(value):
        return ""
    return str(value).strip()


def main():

    print("Loading Dataset 3...")

    df = pd.read_excel(
        WORKBOOK,
        sheet_name="Dataset3_Skill_Gap_Analysis"
    )

    df.columns = df.columns.str.strip()

    required_columns = [
        "Desired_Career",
        "Current_Skill",
        "Missing_Skill",
        "Recommended_Certification",
    ]

    missing = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing:
        raise ValueError(
            f"Missing columns: {missing}"
        )

    rows = []

    for _, row in df.iterrows():

        career = clean(row["Desired_Career"])
        current_skill = clean(row["Current_Skill"])
        missing_skill = clean(row["Missing_Skill"])
        certification = clean(row["Recommended_Certification"])

        if not career:
            continue

        if missing_skill:
            skill = missing_skill
            skill_source = "Missing_Skill"
        elif current_skill:
            skill = current_skill
            skill_source = "Current_Skill"
        else:
            continue

        rows.append({
            "Desired_Career": career,
            "Skill": skill,
            "Skill_Source": skill_source,
            "Required_Level": "",
            "Required_Level_Name": "",
            "Recommended_Certification": certification,
        })

    requirements = pd.DataFrame(rows)

    requirements = requirements.drop_duplicates(
        subset=[
            "Desired_Career",
            "Skill"
        ]
    ).sort_values(
        [
            "Desired_Career",
            "Skill"
        ]
    )

    careers = (
        requirements["Desired_Career"]
        .drop_duplicates()
        .sort_values()
        .reset_index(drop=True)
    )

    career_summary = pd.DataFrame({
        "Desired_Career": careers
    })

    career_summary["Number_of_Skills"] = career_summary[
        "Desired_Career"
    ].map(
        requirements.groupby("Desired_Career")["Skill"].nunique()
    )

    certification_rows = []

    for career in careers:

        career_data = df[
            df["Desired_Career"].astype(str).str.strip()
            == career
        ]

        certifications = (
            career_data["Recommended_Certification"]
            .map(clean)
        )

        certifications = sorted(
            set(
                certification
                for certification in certifications
                if certification
            )
        )

        for certification in certifications:

            certification_rows.append({
                "Desired_Career": career,
                "Recommended_Certification": certification,
            })

    certifications = pd.DataFrame(
        certification_rows
    )

    level_reference = pd.DataFrame({
        "Required_Level": list(LEVELS.keys()),
        "Required_Level_Name": list(LEVELS.values()),
        "Meaning": [
            "Basic awareness or limited ability",
            "Can perform tasks with some independence",
            "Can perform the skill independently in professional work",
            "Can handle advanced or specialist-level work",
        ],
    })

    with pd.ExcelWriter(
        OUTPUT,
        engine="openpyxl"
    ) as writer:

        requirements.to_excel(
            writer,
            sheet_name="Skill_Requirements",
            index=False
        )

        career_summary.to_excel(
            writer,
            sheet_name="Career_Summary",
            index=False
        )

        certifications.to_excel(
            writer,
            sheet_name="Certifications",
            index=False
        )

        level_reference.to_excel(
            writer,
            sheet_name="Level_Reference",
            index=False
        )

    print()
    print("SUCCESS")
    print("=" * 50)
    print(f"Careers: {len(careers)}")
    print(f"Career-skill records: {len(requirements)}")
    print(f"Output: {OUTPUT}")
    print()
    print("IMPORTANT:")
    print("Required_Level is intentionally blank.")
    print("Populate it with validated career requirements")
    print("before using it for production recommendations.")


if __name__ == "__main__":
    main()