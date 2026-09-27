import math

import pytest
from app import calculate_discount


def test_calculate_discount_rejects_non_finite_amount():
    with pytest.raises(ValueError, match="finite"):
        calculate_discount(math.nan, 10)


# Happy paths: normal business inputs.
def test_calculate_discount_accepts_fractional_percentage():
    assert calculate_discount(80, 12.5) == pytest.approx(70)


def test_calculate_discount_keeps_amount_when_percentage_is_zero():
    assert calculate_discount(1234.56, 0) == pytest.approx(1234.56)


# Edge cases: boundary and large-but-valid inputs.
def test_calculate_discount_zero_amount_at_full_percentage_is_zero():
    assert calculate_discount(0, 100) == 0


def test_calculate_discount_large_finite_amount_stays_finite():
    result = calculate_discount(1_000_000_000, 25)
    assert result == pytest.approx(750_000_000)


# Error cases: invalid numeric input must be rejected explicitly.
def test_calculate_discount_rejects_non_finite_percentage():
    with pytest.raises(ValueError, match="between 0 and 100"):
        calculate_discount(100, math.nan)


def test_calculate_discount_rejects_negative_amount():
    with pytest.raises(ValueError, match="non-negative"):
        calculate_discount(-1, 10)
