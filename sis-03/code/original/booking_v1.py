def can_book(start, end, now, blocked, existing):
    """Determine whether a room can be booked on the current day."""
    if not (0 <= start < end <= 1440 and start > now):
        return False
    if end - start > 120:
        return False
    if blocked:
        return False
    for old_start, old_end in existing:
        if start <= old_end and end >= old_start:
            return False
    return True