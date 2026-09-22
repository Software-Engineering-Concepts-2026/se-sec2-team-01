from fizzbuzz import fizzbuzz


def test_fizzbuzz_three_returns_fizz():
    assert fizzbuzz(3) == "Fizz"


def test_fizzbuzz_five_returns_buzz():
    assert fizzbuzz(5) == "Buzz"


def test_fizzbuzz_fifteen_returns_fizzbuzz():
    assert fizzbuzz(15) == "FizzBuzz"


def test_fizzbuzz_one_returns_string():
    assert fizzbuzz(1) == "1"


def test_fizzbuzz_seven_returns_string():
    assert fizzbuzz(7) == "7"


def test_fizzbuzz_six_returns_fizz():
    assert fizzbuzz(6) == "Fizz"


def test_fizzbuzz_ten_returns_buzz():
    assert fizzbuzz(10) == "Buzz"


def test_fizzbuzz_thirty_returns_fizzbuzz():
    assert fizzbuzz(30) == "FizzBuzz"




