from fastapi import APIRouter
from app.analytics.salary import get_market_salary_benchmarks

router = APIRouter(prefix="/api/v1/market", tags=["Market Salary"])

@router.get("/salary")
def get_salaries():
    return {"salary_benchmarks": get_market_salary_benchmarks()}
