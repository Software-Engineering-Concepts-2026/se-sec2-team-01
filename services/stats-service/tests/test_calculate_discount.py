import pytest

from app import calculate_discount


def test_calculate_discount_boundary_zero():
    # Arrange
    amount, percentage = 100, 0

    # Act
    result = calculate_discount(amount, percentage)

    # Assert
    assert result == 100


def test_calculate_discount_normal_percentage():
    # Arrange
    amount, percentage = 100, 10

    # Act
    result = calculate_discount(amount, percentage)

    # Assert
    assert result == 90


def test_calculate_discount_boundary_hundred():
    # Arrange
    amount, percentage = 100, 100

    # Act
    result = calculate_discount(amount, percentage)

    # Assert
    assert result == 0


def test_calculate_discount_negative_percentage():
    # Arrange
    amount, percentage = 100, -1

    # Act & Assert
    with pytest.raises(ValueError):
        calculate_discount(amount, percentage)


def test_calculate_discount_over_hundred_percentage():
    # Arrange
    amount, percentage = 100, 101

    # Act & Assert
    with pytest.raises(ValueError):
        calculate_discount(amount, percentage)