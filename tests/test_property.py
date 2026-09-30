import math
import sys

import pytest
from hypothesis import given, strategies as st

from app import calculate_discount


VALID_AMOUNTS = st.integers(min_value=0, max_value=10_000)
VALID_PERCENTAGES = st.integers(min_value=0, max_value=100)


@given(amount=VALID_AMOUNTS)
def test_zero_percent_preserves_amount(amount):
    assert calculate_discount(amount, 0) == amount


@given(amount=VALID_AMOUNTS)
def test_full_discount_returns_zero(amount):
    assert calculate_discount(amount, 100) == 0


@given(amount=VALID_AMOUNTS, percentage=VALID_PERCENTAGES)
def test_discounted_amount_stays_within_valid_range(amount, percentage):
    result = calculate_discount(amount, percentage)

    assert 0 <= result <= amount


@given(percentage=VALID_PERCENTAGES)
def test_large_finite_amount_stays_within_valid_range(percentage):
    amount = sys.float_info.max

    result = calculate_discount(amount, percentage)

    assert math.isfinite(result)
    assert 0 <= result <= amount


@given(
    amount=VALID_AMOUNTS,
    lower_percentage=VALID_PERCENTAGES,
    increase=VALID_PERCENTAGES,
)
def test_increasing_discount_does_not_increase_result(
    amount, lower_percentage, increase
):
    higher_percentage = min(100, lower_percentage + increase)

    assert calculate_discount(amount, higher_percentage) <= calculate_discount(
        amount, lower_percentage
    )


@given(value=st.sampled_from((math.nan, math.inf, -math.inf)))
def test_non_finite_amount_is_rejected(value):
    with pytest.raises(ValueError, match="amount"):
        calculate_discount(value, 10)


@given(value=st.sampled_from((math.nan, math.inf, -math.inf)))
def test_non_finite_percentage_is_rejected(value):
    with pytest.raises(ValueError, match="percentage"):
        calculate_discount(100, value)
