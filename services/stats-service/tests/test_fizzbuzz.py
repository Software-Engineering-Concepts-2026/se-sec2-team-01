from fizzbuzz import fizzbuzz


def test_fizzbuzz_three_returns_fizz():
    assert fizzbuzz(3) == "Fizz"


def test_fizzbuzz_five_returns_buzz():
    assert fizzbuzz(5) == "Buzz"

