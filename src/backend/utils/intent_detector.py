def users_say_yes(transcript):
    en = ['yes', 'correct', 'right', 'yeah', 'yep', 'uh-huh', 'ok', 'okay']
    vi = ['có', 'đúng', 'phải', 'ừ', 'vâng', 'dạ', 'đồng ý', 'chính xác', 'được']
    return any(word in transcript.lower() for word in en) or any(word in transcript.lower() for word in vi)

def users_say_no(transcript):
    en = ['no', 'wrong', 'incorrect', 'nope', 'nah']
    vi = ['không', 'sai', 'không phải', 'không đúng']
    return any(word in transcript.lower() for word in en) or any(word in transcript.lower() for word in vi)