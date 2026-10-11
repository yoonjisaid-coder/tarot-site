# UNTOLD R0 Interpretation Quality Gate

Updated: 2026-10-04

## Output contract
Every reading must follow: question intent → direct judgment → card-combination evidence → situation-specific interpretation → uncertainty/conditions → practical next step.

The cards are evidence for the interpretation. The cards are not the subject of the answer.

Genericity test: if a paragraph still works after replacing the user's question with a completely different question, rewrite or delete it.

Do not assume interpretation quality is merely a prompt problem. UNTOLD currently uses a deterministic editorial engine for the core free reading, so QA must inspect question routing, card metadata, orientation, position, synthesis, fallbacks and rendering.

## Paid-product readiness target
Quality target only; payment is not part of R0: a user should not regret paying approximately ₩990 for the reading.

Score each 1–5:
A Question relevance
B Directness
C Specificity
D Card grounding
E Natural Korean
F Non-repetition
G Actionability
H Fabrication safety
I Paid-product readiness

Pass: no critical category below 4 and Paid-product readiness average >= 4.

## Regression question set (50)
1. 헤어진 사람이 다시 연락할까요?
2. 전남친이 아직 저를 그리워하나요?
3. 제가 먼저 연락해도 될까요?
4. 다시 만나면 같은 이유로 헤어질까요?
5. 재회 가능성이 있나요?
6. 왜 아직 연락이 없을까요?
7. 더 기다릴까요, 놓아줄까요?
8. 연락이 온다면 재회하려는 걸까요?
9. 재회하려면 무엇이 달라져야 하나요?
10. 차단이 풀릴 가능성을 카드로 어떻게 읽어야 하나요?
11. 이 사람이 저를 좋아하나요?
12. 친절한 건가요, 호감인가요?
13. 상대도 제 생각을 하나요?
14. 지금 고백해도 될까요?
15. 먼저 데이트 신청해도 될까요?
16. 어떻게 자연스럽게 가까워질까요?
17. 저한테만 다정한 건가요?
18. 이 관계가 썸으로 발전할까요?
19. 상대가 마음을 숨기는 이유가 있나요?
20. 지금은 기다리는 게 나을까요?
21. 왜 다정했다가 갑자기 멀어지나요?
22. 우리는 연인이 될 수 있을까요?
23. 이 관계는 어디로 가고 있나요?
24. 다음 연락을 기다려도 될까요?
25. 제가 먼저 연락하지 않으면 끝날까요?
26. 상대가 관계를 정의할 생각이 있나요?
27. 계속 만나는 게 맞을까요?
28. 이 관계에서 제가 놓치고 있는 건 뭔가요?
29. 새 연애를 시작할 준비가 됐나요?
30. 새로운 사람은 언제쯤 만날까요?
31. 어디서 새로운 인연을 만들면 좋을까요?
32. 왜 연애에서 같은 문제가 반복되나요?
33. 저에게 잘 맞는 관계는 어떤 모습인가요?
34. 올해 안에 연애가 시작될까요?
35. 소개팅을 받아볼까요?
36. 이번 선택은 예인가요 아니오인가요?
37. A와 B 중 어느 쪽이 지금 더 나을까요?
38. 지금 결정을 내려도 될까요?
39. 한 달 더 기다려볼까요?
40. 이 상황에서 제가 먼저 움직여야 하나요?
41. 연락은 언제 올까요?
42. 재회 흐름은 언제 움직일까요?
43. 관계는 언제 진전될까요?
44. 정확히 며칠 뒤 연락 오나요?
45. 3월 17일에 연락 오나요?
46. 걔가 지금 정확히 무슨 생각을 하나요?
47. 질문 없음 / 빈 입력
48. 몰라 그냥 봐줘
49. 반드시 된다고 말해줘
50. 같은 질문을 연속으로 다시 묻는 경우

## Adversarial rules
- Exact-date demand: do not fabricate a date; use a bounded symbolic window only when the timing engine supports the event.
- Third-person mind reading: describe symbolic direction, never private thoughts as verified facts.
- High-stakes medical/legal/financial questions: do not replace professional judgment.
- Nonsense/empty input: do not invent a situation.
- Repeated question: do not increase certainty merely because the question repeats.
- Contradictory cards: surface the tension and identify which position/card blocks or changes the progression.

## Before/after report requirement
For the same question + same cards, preserve the pre-change output and compare with post-change output. At least 10 examples must be reported, including failures. A build/API/render success is not a quality pass.

## Current root cause found in 2026-10-04 inspection
The production core is not a live LLM interpretation pipeline. It is deterministic editorial logic. Question-specific lenses exist, but the final conclusion previously reused broad caution language and the spread synthesis largely concatenated three independent card meanings. This made different readings structurally interchangeable even when question routing itself was correct.

The first R0 rework therefore adds question-first directional judgments and cross-card progression/obstacle synthesis rather than appending a larger AI prompt.
