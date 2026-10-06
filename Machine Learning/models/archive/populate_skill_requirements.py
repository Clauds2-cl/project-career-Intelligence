from pathlib import Path
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent

INPUT_FILE = BASE_DIR / "Career Skill Requirements.xlsx"
OUTPUT_FILE = BASE_DIR / "Career Skill Requirements.xlsx"


REQUIREMENTS = {
    "Accountant": {
        "Financial Modelling": 3,
        "Taxation": 3,
    },
    "Actuarial Analyst": {
        "Actuarial Modelling": 3,
    },
    "Agribusiness Manager": {
        "Financial Planning": 3,
    },
    "Agricultural Officer": {
        "GIS": 2,
        "Precision Farming": 3,
    },
    "Airline Operations Officer": {
        "Aviation Safety Management": 3,
    },
    "Airport Operations Officer": {
        "Airport Security Management": 3,
    },
    "Architect": {
        "3D Modelling (Revit)": 3,
    },
    "Bank Officer": {
        "Risk Management": 3,
    },
    "Business Administrator": {
        "Project Management": 3,
    },
    "Business Analyst": {
        "Data Analytics": 3,
        "Power BI": 2,
    },
    "Civil Engineer": {
        "BIM": 3,
        "Project Management": 2,
    },
    "Clinical Officer": {
        "Specialized Diagnostics": 3,
    },
    "Community Development Officer": {
        "Monitoring and Evaluation": 3,
    },
    "Conservation Officer": {
        "GIS Mapping": 3,
    },
    "Data Analyst": {
        "Machine Learning": 2,
        "Power BI": 3,
    },
    "Data Scientist": {
        "Deep Learning": 3,
        "MLOps": 3,
    },
    "Electrical Engineer": {
        "Renewable Energy Systems": 3,
    },
    "Environmental Officer": {
        "Climate Policy": 3,
        "GIS": 2,
    },
    "Film Producer": {
        "Budgeting for Film": 3,
    },
    "Financial Analyst": {
        "Investment Analysis": 3,
    },
    "Graphic Designer": {
        "Motion Graphics": 3,
        "UI/UX Design": 3,
    },
    "Horticulturist": {
        "Greenhouse Management": 3,
    },
    "Hotel Manager": {
        "Revenue Management": 3,
    },
    "IT Support Specialist": {
        "Cloud Support": 2,
        "Cybersecurity": 2,
    },
    "Illustrator": {
        "Character Design": 3,
    },
    "Journalist": {
        "Digital Journalism": 3,
        "Video Editing": 2,
    },
    "Lawyer / Advocate": {
        "Case Management": 3,
        "Litigation Skills": 3,
    },
    "Marketing Executive": {
        "Data-Driven Marketing": 3,
        "SEO": 3,
    },
    "Mechanical Engineer": {
        "CAD/CAM": 3,
        "PLC Programming": 2,
    },
    "Medical Doctor": {
        "Specialization": 4,
        "Surgery Skills": 4,
    },
    "Mobile App Developer": {
        "Flutter": 3,
        "UI/UX Design": 2,
    },
    "Network Administrator": {
        "Cloud Networking": 3,
        "Security": 3,
    },
    "News Anchor": {
        "Broadcast Presentation": 3,
    },
    "Operations Manager": {
        "Supply Chain Optimization": 3,
    },
    "Pharmacist": {
        "Clinical Pharmacy": 3,
    },
    "Physical Education Teacher": {
        "Sports Psychology": 2,
    },
    "Procurement Officer": {
        "Contract Management": 3,
    },
    "Public Relations Officer": {
        "Crisis Management": 3,
    },
    "Registered Nurse": {
        "Critical Care Nursing": 3,
        "Emergency Care": 3,
    },
    "Social Worker": {
        "Community Mobilization": 3,
    },
    "Software Engineer": {
        "Cloud Computing": 2,
        "DevOps": 2,
        "System Design": 3,
    },
    "Sports Coach": {
        "Sports Science Analytics": 2,
    },
    "Supply Chain Analyst": {
        "Data Analytics": 2,
    },
    "Systems Analyst": {
        "Cloud": 2,
        "Data Modelling": 3,
    },
    "Teacher": {
        "ICT Integration": 2,
        "Public Speaking": 3,
    },
    "Tourism Officer": {
        "Digital Marketing for Tourism": 3,
    },
    "Travel Consultant": {
        "Amadeus / GDS Systems": 3,
    },
    "Video Editor": {
        "Motion Graphics": 3,
    },
}


LEVEL_NAMES = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
    4: "Expert",
}


def main():

    print("Loading career skill requirements...")

    requirements = []

    for career, skills in REQUIREMENTS.items():

        for skill, level in skills.items():

            requirements.append({
                "Desired_Career": career,
                "Skill": skill,
                "Required_Level": level,
                "Required_Level_Name": LEVEL_NAMES[level],
                "Basis": "Configured career requirement",
            })

    requirements_df = pd.DataFrame(requirements)

    existing = pd.read_excel(
        INPUT_FILE,
        sheet_name="Skill_Requirements"
    )

    certifications = pd.read_excel(
        INPUT_FILE,
        sheet_name="Certifications"
    )

    career_summary = pd.read_excel(
        INPUT_FILE,
        sheet_name="Career_Summary"
    )

    level_reference = pd.read_excel(
        INPUT_FILE,
        sheet_name="Level_Reference"
    )

    with pd.ExcelWriter(
        OUTPUT_FILE,
        engine="openpyxl"
    ) as writer:

        requirements_df.to_excel(
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
    print(f"Careers configured: {requirements_df['Desired_Career'].nunique()}")
    print(f"Skills configured: {len(requirements_df)}")
    print()
    print("Required proficiency levels:")
    print(requirements_df["Required_Level_Name"].value_counts().to_string())
    print()
    print(f"Updated file: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()