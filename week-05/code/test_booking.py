import unittest
from booking import can_book

class BookingTests(unittest.TestCase):
    def test_touching_end_allowed(self):
        # AC4; expected result comes from the specification
        self.assertIs(can_book(660, 720, 540, False, [(600, 660)]), True)

    def test_exactly_two_hours(self):
        # AC2; expected result comes from the specification
        self.assertIs(can_book(720, 840, 540, False, [(600, 660)]), True)

    def test_partial_overlap(self):
        # AC4; expected result comes from the specification
        self.assertIs(can_book(630, 690, 540, False, [(600, 660)]), False)

    def test_over_two_hours(self):
        # AC2; expected result comes from the specification
        self.assertIs(can_book(720, 841, 540, False, [(600, 660)]), False)

    def test_blocked(self):
        # AC3; expected result comes from the specification
        self.assertIs(can_book(660, 720, 540, True, [(600, 660)]), False)

    def test_starts_now(self):
        # AC1; expected result comes from the specification
        self.assertIs(can_book(540, 570, 540, False, [(600, 660)]), False)

    def test_zero_length(self):
        # AC1; expected result comes from the specification
        self.assertIs(can_book(660, 660, 540, False, []), False)

    def test_reversed(self):
        # AC1; expected result comes from the specification
        self.assertIs(can_book(700, 660, 540, False, []), False)

    def test_negative_start(self):
        # AC1; expected result comes from the specification
        self.assertIs(can_book(-1, 30, 0, False, []), False)

    def test_beyond_day(self):
        # AC1; expected result comes from the specification
        self.assertIs(can_book(1400, 1441, 540, False, []), False)

    def test_at_day_end(self):
        # AC1; expected result comes from the specification
        self.assertIs(can_book(1439, 1440, 540, False, []), True)

    def test_empty_bookings(self):
        # AC4; expected result comes from the specification
        self.assertIs(can_book(700, 720, 540, False, []), True)

    def test_several_no_overlap(self):
        # AC4; expected result comes from the specification
        self.assertIs(can_book(660, 690, 540, False, [(570, 600), (600, 660), (720, 780)]), True)

    def test_several_conflict_second(self):
        # AC4; expected result comes from the specification
        self.assertIs(can_book(680, 730, 540, False, [(570, 600), (720, 780)]), False)

    def test_touching_start_allowed(self):
        # AC4; expected result comes from the specification
        self.assertIs(can_book(570, 600, 540, False, [(600, 660)]), True)

    def test_inside_existing(self):
        # AC4; expected result comes from the specification
        self.assertIs(can_book(615, 645, 540, False, [(600, 660)]), False)

    def test_contains_existing(self):
        # AC4; expected result comes from the specification
        self.assertIs(can_book(570, 690, 540, False, [(600, 660)]), False)

    def test_same_interval(self):
        # AC4; expected result comes from the specification
        self.assertIs(can_book(600, 660, 540, False, [(600, 660)]), False)

    def test_start_before_now(self):
        # AC1; expected result comes from the specification
        self.assertIs(can_book(539, 570, 540, False, []), False)

    def test_one_minute(self):
        # AC1; expected result comes from the specification
        self.assertIs(can_book(541, 542, 540, False, []), True)

    def test_exactly_120_with_conflict(self):
        # AC4; expected result comes from the specification
        self.assertIs(can_book(570, 690, 540, False, [(600, 660)]), False)

    def test_no_mutation(self):
        # AC5; expected result comes from the specification
        existing = [(720, 780), (600, 660)]
        original = list(existing)
        self.assertIs(can_book(660, 720, 540, False, existing), True)
        self.assertEqual(existing, original)

    def test_overlap_ends_at_existing_end(self):
        # AC4; expected result comes from the specification
        self.assertIs(can_book(650, 660, 540, False, [(600, 660)]), False)

    def test_overlap_starts_at_existing_start(self):
        # AC4; expected result comes from the specification
        self.assertIs(can_book(600, 620, 540, False, [(600, 660)]), False)