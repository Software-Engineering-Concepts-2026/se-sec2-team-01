"""Unit tests for calculate_discount using equivalence partitions and boundaries."""

import math

import pytest
from app import calculate_discount


def test_calculate_discount_standard_percentage():
    # Arrange
    amount, percentage = 100, 10

    # Act
    result = calculate_discount(amount, percentage)

    # Assert
    assert result == 90


def test_calculate_discount_fractional_percentage():
    # Arrange
    amount, percentage = 80, 12.5

    # Act
    result = calculate_discount(amount, percentage)

    # Assert
    assert result == 70


def test_calculate_discount_zero_percent_keeps_amount():
    # Arrange
    amount, percentage = 1234.56, 0

    # Act
    result = calculate_discount(amount, percentage)

    # Assert
    assert result == amount


def test_calculate_discount_hundred_percent_returns_zero():
    # Arrange
    amount, percentage = 100, 100

    # Act
    result = calculate_discount(amount, percentage)

    # Assert
    assert result == 0


def test_calculate_discount_zero_amount_returns_zero():
    # Arrange
    amount, percentage = 0, 35

    # Act
    result = calculate_discount(amount, percentage)

    # Assert
    assert result == 0


def test_calculate_discount_large_finite_amount_stays_finite():
    # Arrange
    amount, percentage = 1_000_000_000, 25

    # Act
    result = calculate_discount(amount, percentage)

    # Assert
    assert math.isfinite(result)
    assert result == 750_000_000


def test_calculate_discount_rejects_negative_amount():
    # Arrange
    amount, percentage = -1, 10

    # Act / Assert
    with pytest.raises(ValueError, match="amount"):
        calculate_discount(amount, percentage)


def test_calculate_discount_rejects_percentage_over_hundred():
    # Arrange
    amount, percentage = 100, 101

    # Act / Assert
    with pytest.raises(ValueError, match="percentage"):
        calculate_discount(amount, percentage)
