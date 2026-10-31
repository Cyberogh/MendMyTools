"""
One-command local runner for MendMyTools Cloud Atelier (SQLite + FastAPI).

Authors:
  - Devashish Chaudhry (24A12RES230)
  - Devansh Ranjan (24A12RES227)

Run from the project root:   python run_local.py
"""
import os

# Force SQLite BEFORE the app loads its settings (overrides any .env value).
os.environ["DATABASE_URL"] = "sqlite:///./mendmytools.db"
os.environ.setdefault("SECRET_KEY", "mendmytools-cloud-secret-key-0123456789abcdef")

import uvicorn  # noqa: E402

from core.security import hash_password  # noqa: E402
from db.db import Base, SessionLocal, engine  # noqa: E402
import models.user  # noqa: E402,F401
import models.ticket  # noqa: E402,F401
import models.comment  # noqa: E402,F401
import models.rating  # noqa: E402,F401
from models.enums import Role, TicketPriority, TicketStatus  # noqa: E402
from models.user import User  # noqa: E402
from models.ticket import Ticket  # noqa: E402
from models.comment import TicketComment  # noqa: E402
from models.rating import TicketRating  # noqa: E402

ACCOUNTS = [
    ("Devashish Chaudhry (Admin)", "admin@mendmytools.com", "admin123", Role.ADMIN),
    ("Devansh Ranjan (Specialist)", "agent@mendmytools.com", "agent123", Role.AGENT),
    ("Atelier Member", "employee@mendmytools.com", "employee123", Role.EMPLOYEE),
    # Legacy aliases for convenience
    ("Admin Legacy", "admin@helpdesk.com", "admin123", Role.ADMIN),
    ("Agent Legacy", "agent@helpdesk.com", "agent123", Role.AGENT),
    ("Employee Legacy", "employee@helpdesk.com", "employee123", Role.EMPLOYEE),
]


def setup() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        user_map = {}
        for name, email, password, role in ACCOUNTS:
            existing = db.query(User).filter(User.email == email).first()
            if not existing:
                existing = User(
                    name=name,
                    email=email,
                    password_hash=hash_password(password),
                    role=role,
                    is_active=True,
                )
                db.add(existing)
                db.commit()
                db.refresh(existing)
            user_map[email] = existing

        # Seed realistic enterprise tool & cloud repair tickets if none exist yet
        if db.query(Ticket).count() == 0:
            emp = user_map["employee@mendmytools.com"]
            agent = user_map["agent@mendmytools.com"]
            sample_tickets = [
                Ticket(
                    title="CNC Laser Calibration Drift on Precision Unit #04",
                    description="Optical sensor alignment deviates by 0.4mm under sustained high-load runs. Requesting urgent firmware recalibration and lens diagnostic.",
                    status=TicketStatus.IN_PROGRESS,
                    priority=TicketPriority.HIGH,
                    created_by=emp.id,
                    assigned_to=agent.id,
                    current_resolution_cycle=1,
                ),
                Ticket(
                    title="AWS EC2 Auto-Scaling Group Healthcheck Timeout (S1 Critical)",
                    description="Production worker container failed /docs probe after memory spike. Docker restart policy triggered recovery in 32 seconds; verifying root cause.",
                    status=TicketStatus.CLOSED,
                    priority=TicketPriority.CRITICAL,
                    created_by=emp.id,
                    assigned_to=agent.id,
                    current_resolution_cycle=1,
                ),
                Ticket(
                    title="Hydraulic Torque Wrench Telemetry Sync Failure",
                    description="Bluetooth gateway module drops packets when streaming calibration logs to the MendMyTools cloud console.",
                    status=TicketStatus.OPEN,
                    priority=TicketPriority.MEDIUM,
                    created_by=emp.id,
                    assigned_to=None,
                    current_resolution_cycle=1,
                ),
                Ticket(
                    title="Industrial 3D Sintering Extruder Thermal Sensor Replacement",
                    description="Thermocouple reading fluctuates above 280C. Replacement module installed and verified under 2-hour stress test.",
                    status=TicketStatus.CLOSED,
                    priority=TicketPriority.LOW,
                    created_by=emp.id,
                    assigned_to=agent.id,
                    current_resolution_cycle=1,
                ),
            ]
            db.add_all(sample_tickets)
            db.commit()
            for t in sample_tickets:
                db.refresh(t)

            # Add sample comment & 5-star ratings on closed tickets
            db.add(
                TicketComment(
                    ticket_id=sample_tickets[0].id,
                    user_id=agent.id,
                    comment="Diagnostic complete: optical mirror assembly realigned and firmware patched to v4.2. Running final SLA verification.",
                )
            )
            db.add(
                TicketRating(
                    ticket_id=sample_tickets[1].id,
                    employee_id=emp.id,
                    agent_id=agent.id,
                    rating=5,
                    feedback="Container recovered in 32 seconds with zero data loss. Outstanding SLA compliance!",
                    resolution_cycle=1,
                )
            )
            db.add(
                TicketRating(
                    ticket_id=sample_tickets[3].id,
                    employee_id=emp.id,
                    agent_id=agent.id,
                    rating=5,
                    feedback="Thermal sensor replaced ahead of schedule.",
                    resolution_cycle=1,
                )
            )
            db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    setup()
    print("\n=======================================================")
    print("  MENDMYTOOLS · Cloud Repair & Support Atelier Ready")
    print("  Curated by Devashish Chaudhry & Devansh Ranjan")
    print("=======================================================")
    print("Log in at http://localhost:3000 with:")
    for _, email, password, role in ACCOUNTS[:3]:
        print(f"  {role.value:9s}  {email:26s}  /  {password}")
    print("Swagger API Docs: http://127.0.0.1:8000/docs\n")
    uvicorn.run("main:app", host="127.0.0.1", port=8000)
