"""
Management command to populate comprehensive test data for EDU Sekai.
Only runs if database is empty to avoid duplication.
For multi-tenant systems, use --schema to specify the tenant.
"""

from django.core.management.base import BaseCommand, CommandError
from django.db import connection, transaction
from django.utils import timezone
from datetime import timedelta, datetime
from faker import Faker
import random
import uuid

from accounts.models import User
from profiles.models import Profile, InstitutionProfile
from academics.models import Program, AcademicLevel, Section, Subject, SubjectAssignment
from students.models import Student, StudentLevel, AcademicHistory
from staff.models import StaffMember, Instructor
from families.models import Parent, StudentParentRelation
from course_content.models import (
    CourseContent,
    SubjectEnrollment,
    Assignment,
    AssignmentSubmission,
)


class Command(BaseCommand):
    help = (
        "Populate comprehensive test data for all modules in a specific tenant schema"
    )

    def __init__(self):
        super().__init__()
        self.fake = Faker()
        self.tenant = None  # Store tenant for later use
        self.created_users = []
        self.created_profiles = []
        self.created_staff = []
        self.created_instructors = []
        self.created_students = []
        self.created_parents = []
        self.created_programs = []
        self.created_levels = []
        self.created_sections = []
        self.created_subjects = []

    def add_arguments(self, parser):
        parser.add_argument(
            "--schema",
            type=str,
            help="Tenant schema name to populate (required for multi-tenant setup)",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Force population even if data exists",
        )

    def handle(self, *args, **options):
        schema_name = options.get("schema")
        force = options.get("force", False)

        # Validate schema is provided
        if not schema_name:
            raise CommandError(
                "Schema name is required. Use --schema=<tenant_schema_name>\n"
                "Example: python manage.py populate_test_data --schema=medhavi"
            )

        # Switch to the specified tenant schema
        self.stdout.write(f"Switching to schema: {schema_name}")

        try:
            from organizations.models import Organization

            # Verify the tenant exists
            try:
                tenant = Organization.objects.get(schema_name=schema_name)
                self.tenant = tenant  # Store for later use
            except Organization.DoesNotExist:
                raise CommandError(
                    f"Tenant with schema '{schema_name}' does not exist.\n"
                    f"Please create the organization first."
                )

            # Set the schema for this connection
            connection.set_schema(schema_name)
            self.stdout.write(
                self.style.SUCCESS(f"✓ Connected to schema: {schema_name}")
            )

        except Exception as e:
            raise CommandError(f"Error connecting to schema '{schema_name}': {str(e)}")

        # Check if data already exists
        if not force and self._data_exists():
            self.stdout.write(
                self.style.WARNING(
                    f"Test data already exists in schema '{schema_name}'. "
                    "Use --force to populate anyway."
                )
            )
            return

        self.stdout.write(self.style.SUCCESS("Starting test data population..."))

        try:
            with transaction.atomic():
                # Create test data in order of dependencies
                self.create_institution_profile()
                self.create_academic_structure()
                self.create_staff_and_instructors()
                self.create_students_and_families()
                self.create_subject_assignments()
                self.create_student_enrollments()
                self.create_course_content()
                self.create_assignments_and_submissions()

            self.stdout.write(
                self.style.SUCCESS(
                    f"\n✅ Successfully populated test data in schema '{schema_name}'!\n"
                    f"   - Programs: {len(self.created_programs)}\n"
                    f"   - Levels: {len(self.created_levels)}\n"
                    f"   - Sections: {len(self.created_sections)}\n"
                    f"   - Subjects: {len(self.created_subjects)}\n"
                    f"   - Instructors: {len(self.created_instructors)}\n"
                    f"   - Students: {len(self.created_students)}\n"
                    f"   - Parents: {len(self.created_parents)}\n"
                )
            )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error populating data: {str(e)}"))
            raise

    def _data_exists(self):
        """Check if test data already exists"""
        return (
            Program.objects.exists()
            or Student.objects.exists()
            or StaffMember.objects.exists()
        )

    def create_institution_profile(self):
        """Create institution branding profile"""
        self.stdout.write("Creating institution profile...")

        # Use the tenant we already have
        if self.tenant:
            InstitutionProfile.objects.get_or_create(
                organization_id=self.tenant.id,
                defaults={
                    "tagline": self.fake.catch_phrase(),
                    "mission": self.fake.paragraph(nb_sentences=3),
                    "vision": self.fake.paragraph(nb_sentences=2),
                    "about": self.fake.paragraph(nb_sentences=5),
                    "established_date": self.fake.date_between(
                        start_date="-50y", end_date="-5y"
                    ),
                    "website": self.fake.url(),
                },
            )
            self.stdout.write(self.style.SUCCESS("  ✓ Institution profile created"))

    def create_academic_structure(self):
        """Create programs, levels, sections, and subjects"""
        self.stdout.write("Creating academic structure...")

        # Programs
        programs_data = [
            {
                "name": "High School",
                "code": "HS",
                "description": "High School Education Program",
            },
            {
                "name": "Bachelor of Science",
                "code": "BSC",
                "description": "Undergraduate Science Program",
            },
            {"name": "A-Levels", "code": "AL", "description": "Advanced Level Program"},
        ]

        for prog_data in programs_data:
            program, _ = Program.objects.get_or_create(
                code=prog_data["code"], defaults=prog_data
            )
            self.created_programs.append(program)

        # Levels
        for program in self.created_programs:
            if program.code == "HS":
                levels = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"]
            elif program.code == "BSC":
                levels = ["Semester 1", "Semester 2", "Semester 3", "Semester 4"]
            else:
                levels = ["AS Level", "A2 Level"]

            for idx, level_name in enumerate(levels, 1):
                level, _ = AcademicLevel.objects.get_or_create(
                    program=program, name=level_name, defaults={"order": idx}
                )
                self.created_levels.append(level)

                # Sections for each level
                section_names = (
                    ["A", "B", "C"] if program.code == "HS" else ["Group 1", "Group 2"]
                )
                for sec_name in section_names:
                    section, _ = Section.objects.get_or_create(
                        level=level,
                        name=sec_name,
                        defaults={"capacity": random.randint(30, 50)},
                    )
                    self.created_sections.append(section)

        # Subjects
        subjects_data = [
            ("MTH", "Mathematics", 3.0, False),
            ("ENG", "English", 3.0, False),
            ("SCI", "Science", 4.0, False),
            ("HIS", "History", 2.0, True),
            ("GEO", "Geography", 2.0, True),
            ("CS", "Computer Science", 3.0, True),
            ("PHY", "Physics", 4.0, False),
            ("CHEM", "Chemistry", 4.0, False),
        ]

        for level in self.created_levels:
            # Add 5-6 random subjects per level
            selected_subjects = random.sample(
                subjects_data, k=random.randint(5, min(6, len(subjects_data)))
            )

            for code_prefix, name, credits, is_elective in selected_subjects:
                code = f"{code_prefix}{level.order:02d}"
                subject, _ = Subject.objects.get_or_create(
                    level=level,
                    code=code,
                    defaults={
                        "name": f"{name} {level.name}",
                        "credits": credits,
                        "is_elective": is_elective,
                        "description": self.fake.paragraph(nb_sentences=2),
                    },
                )
                self.created_subjects.append(subject)

        self.stdout.write(self.style.SUCCESS("  ✓ Academic structure created"))

    def create_staff_and_instructors(self):
        """Create staff members and instructors"""
        self.stdout.write("Creating staff and instructors...")

        num_staff = 15
        num_instructors = 10

        for i in range(num_staff):
            # Create User in public schema
            username = f"staff_{self.fake.user_name()}_{i}"
            user = User.objects.create_user(
                username=username,
                email=f"{username}@example.com",
                password="password123",
            )
            self.created_users.append(user)

            # Create Profile
            profile = Profile.objects.create(
                user_id=user.id,
                first_name=self.fake.first_name(),
                middle_name=(
                    self.fake.first_name() if random.choice([True, False]) else ""
                ),
                last_name=self.fake.last_name(),
                gender=random.choice(["male", "female", "other"]),
                date_of_birth=self.fake.date_of_birth(minimum_age=25, maximum_age=60),
                blood_group=random.choice(
                    ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
                ),
                phone=self.fake.phone_number()[:20],
                address=self.fake.address(),
                local_username=username,
            )
            self.created_profiles.append(profile)

            # Create StaffMember
            employee_id = f"EMP{2024}{i+1:04d}"
            staff = StaffMember.objects.create(
                profile=profile,
                employee_id=employee_id,
                designation=random.choice(
                    ["Teacher", "Senior Teacher", "Assistant Professor", "Professor"]
                ),
                department=random.choice(
                    ["Science", "Arts", "Commerce", "Administration"]
                ),
                joining_date=self.fake.date_between(start_date="-10y", end_date="-1y"),
                qualification=f"{random.choice(['M.Sc.', 'M.A.', 'Ph.D.', 'M.Ed.'])} in {self.fake.job()}",
                experience_years=random.randint(1, 20),
            )
            self.created_staff.append(staff)

            # Make some staff into instructors
            if i < num_instructors:
                instructor = Instructor.objects.create(
                    staff_member=staff,
                    specialization=random.choice(
                        [
                            "Mathematics",
                            "Physics",
                            "Chemistry",
                            "Biology",
                            "English",
                            "Computer Science",
                            "History",
                            "Geography",
                        ]
                    ),
                    license_number=f"LIC{random.randint(100000, 999999)}",
                    bio=self.fake.paragraph(nb_sentences=4),
                )
                self.created_instructors.append(instructor)

        self.stdout.write(self.style.SUCCESS("  ✓ Staff and instructors created"))

    def create_students_and_families(self):
        """Create students and their parent relationships"""
        self.stdout.write("Creating students and families...")

        num_students = 50
        current_year = datetime.now().year

        for i in range(num_students):
            # Create User
            username = f"student_{self.fake.user_name()}_{i}"
            user = User.objects.create_user(
                username=username,
                email=f"{username}@example.com",
                password="password123",
            )
            self.created_users.append(user)

            # Create Profile
            profile = Profile.objects.create(
                user_id=user.id,
                first_name=self.fake.first_name(),
                middle_name=(
                    self.fake.first_name() if random.choice([True, False]) else ""
                ),
                last_name=self.fake.last_name(),
                gender=random.choice(["male", "female"]),
                date_of_birth=self.fake.date_of_birth(minimum_age=10, maximum_age=25),
                blood_group=random.choice(
                    ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
                ),
                phone=self.fake.phone_number()[:20],
                address=self.fake.address(),
                local_username=username,
            )
            self.created_profiles.append(profile)

            # Create Student
            enrollment_id = f"STU{current_year}{i+1:04d}"
            student = Student.objects.create(
                profile=profile,
                enrollment_id=enrollment_id,
                admission_date=self.fake.date_between(
                    start_date="-5y", end_date="today"
                ),
                status=random.choice(
                    ["active", "active", "active", "inactive"]
                ),  # 75% active
            )
            self.created_students.append(student)

            # Assign student to a level and section
            level = random.choice(self.created_levels)
            section = random.choice(
                [s for s in self.created_sections if s.level == level]
            )

            StudentLevel.objects.create(
                student=student,
                level=level,
                section=section,
                academic_year=str(current_year),
                is_current=True,
            )

            # Create Academic History
            if random.choice([True, False]):
                AcademicHistory.objects.create(
                    student=student,
                    previous_school=self.fake.company(),
                    last_grade_passed=f"Grade {random.randint(1, 10)}",
                    completion_year=random.randint(current_year - 5, current_year - 1),
                    remarks=self.fake.sentence(),
                )

            # Create Parents (1-2 per student)
            num_parents = random.randint(1, 2)
            for j in range(num_parents):
                # Create parent user and profile
                parent_username = f"parent_{self.fake.user_name()}_{i}_{j}"
                parent_user = User.objects.create_user(
                    username=parent_username,
                    email=f"{parent_username}@example.com",
                    password="password123",
                )

                parent_profile = Profile.objects.create(
                    user_id=parent_user.id,
                    first_name=self.fake.first_name(),
                    last_name=profile.last_name,  # Same last name as student
                    gender=random.choice(["male", "female"]),
                    date_of_birth=self.fake.date_of_birth(
                        minimum_age=30, maximum_age=60
                    ),
                    phone=self.fake.phone_number()[:20],
                    address=profile.address,  # Same address as student
                    local_username=parent_username,
                )

                parent = Parent.objects.create(
                    profile=parent_profile,
                    occupation=self.fake.job(),
                    office_address=self.fake.address(),
                    income_level=random.choice(["Low", "Middle", "High"]),
                )

                if j == 0:  # First parent not in our list yet
                    self.created_parents.append(parent)

                # Create relationship
                relation_type = (
                    "father" if j == 0 else random.choice(["mother", "guardian"])
                )
                StudentParentRelation.objects.create(
                    student=student,
                    parent=parent,
                    relation_type=relation_type,
                    is_primary_contact=(j == 0),
                    can_pickup=True,
                )

        self.stdout.write(self.style.SUCCESS("  ✓ Students and families created"))

    def create_subject_assignments(self):
        """Assign instructors to subjects in sections"""
        self.stdout.write("Creating subject assignments...")

        for section in self.created_sections:
            # Get subjects for this section's level
            level_subjects = [
                s for s in self.created_subjects if s.level == section.level
            ]

            for subject in level_subjects:
                # Assign a random instructor
                if self.created_instructors:
                    instructor = random.choice(self.created_instructors)
                    SubjectAssignment.objects.get_or_create(
                        section=section,
                        subject=subject,
                        defaults={"instructor": instructor},
                    )

        self.stdout.write(self.style.SUCCESS("  ✓ Subject assignments created"))

    def create_student_enrollments(self):
        """Enroll students in subjects"""
        self.stdout.write("Creating student subject enrollments...")

        current_year = str(datetime.now().year)

        for student in self.created_students:
            # Get student's current level
            student_level = StudentLevel.objects.filter(
                student=student, is_current=True
            ).first()

            if student_level:
                # Get all subjects for this level
                level_subjects = Subject.objects.filter(level=student_level.level)

                # Enroll in all core subjects and some electives
                for subject in level_subjects:
                    if not subject.is_elective or random.choice([True, False]):
                        SubjectEnrollment.objects.get_or_create(
                            student=student, subject=subject, academic_year=current_year
                        )

        self.stdout.write(self.style.SUCCESS("  ✓ Student subject enrollments created"))

    def create_course_content(self):
        """Create course materials"""
        self.stdout.write("Creating course content...")

        content_types = ["note", "document", "video", "link"]

        # Create 20-30 pieces of content
        for i in range(random.randint(20, 30)):
            content_type = random.choice(content_types)
            creator = random.choice(self.created_staff)

            # Pick random targeting
            program = (
                random.choice(self.created_programs)
                if random.choice([True, False])
                else None
            )
            level = (
                random.choice(self.created_levels)
                if random.choice([True, False])
                else None
            )
            subjects = random.sample(self.created_subjects, k=random.randint(1, 3))

            content = CourseContent.objects.create(
                title=self.fake.sentence(nb_words=6),
                description=self.fake.paragraph(nb_sentences=3),
                content_type=content_type,
                external_url=(
                    self.fake.url()
                    if content_type == "link" or content_type == "video"
                    else None
                ),
                created_by=creator,
                is_published=random.choice([True, True, True, False]),  # 75% published
                publish_date=timezone.now() - timedelta(days=random.randint(1, 90)),
                is_pinned=random.choice([True, False, False, False]),  # 25% pinned
            )

            # Set targets
            if program:
                content.target_programs.add(program)
            if level:
                content.target_levels.add(level)
            for subject in subjects:
                content.target_subjects.add(subject)

        self.stdout.write(self.style.SUCCESS("  ✓ Course content created"))

    def create_assignments_and_submissions(self):
        """Create assignments and student submissions"""
        self.stdout.write("Creating assignments and submissions...")

        # Create 10-15 assignments
        for i in range(random.randint(10, 15)):
            creator = random.choice(self.created_staff)
            subjects = random.sample(self.created_subjects, k=random.randint(1, 2))
            level = subjects[0].level

            # Create course content first
            content = CourseContent.objects.create(
                title=f"Assignment: {self.fake.sentence(nb_words=4)}",
                description=self.fake.paragraph(nb_sentences=2),
                content_type="assignment",
                created_by=creator,
                is_published=True,
                publish_date=timezone.now() - timedelta(days=random.randint(1, 60)),
            )

            content.target_levels.add(level)
            for subject in subjects:
                content.target_subjects.add(subject)

            # Create assignment details
            due_date = timezone.now() + timedelta(days=random.randint(-30, 30))
            assignment = Assignment.objects.create(
                content=content,
                due_date=due_date,
                total_points=random.choice([50, 100, 150, 200]),
                submission_type=random.choice(["file", "text", "link"]),
                allow_late_submission=random.choice([True, False]),
                late_penalty_percent=(
                    random.randint(0, 20) if random.choice([True, False]) else 0
                ),
                instructions=self.fake.paragraph(nb_sentences=5),
            )

            # Create submissions from enrolled students
            enrolled_students = (
                SubjectEnrollment.objects.filter(subject__in=subjects)
                .values_list("student", flat=True)
                .distinct()
            )

            for student_id in enrolled_students:
                student = Student.objects.get(id=student_id)

                # 70% of students submit
                if random.random() < 0.7:
                    submitted_at = due_date - timedelta(days=random.randint(-5, 10))
                    status = "submitted"

                    # 60% of submitted assignments are graded
                    if random.random() < 0.6:
                        status = "graded"
                        score = random.uniform(60, 100)
                        feedback = self.fake.paragraph(nb_sentences=2)
                        graded_by = random.choice(self.created_staff)
                        graded_at = submitted_at + timedelta(days=random.randint(1, 7))
                    else:
                        score = None
                        feedback = ""
                        graded_by = None
                        graded_at = None
                else:
                    # Not submitted
                    submitted_at = None
                    status = "pending"
                    score = None
                    feedback = ""
                    graded_by = None
                    graded_at = None

                submission_text = (
                    self.fake.paragraph(nb_sentences=4)
                    if assignment.submission_type == "text" and status != "pending"
                    else ""
                )
                submission_url = (
                    self.fake.url()
                    if assignment.submission_type == "link" and status != "pending"
                    else ""
                )

                AssignmentSubmission.objects.create(
                    assignment=assignment,
                    student=student,
                    submitted_at=submitted_at,
                    submission_text=submission_text,
                    submission_url=submission_url,
                    status=status,
                    score=score,
                    feedback=feedback,
                    graded_by=graded_by,
                    graded_at=graded_at,
                )

        self.stdout.write(self.style.SUCCESS("  ✓ Assignments and submissions created"))
