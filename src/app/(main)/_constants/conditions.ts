interface Condition {
  option: string;
}

type ConditionKeys = 1 | 2 | 3 | 4 | 5;

const conditions = {
  1: { option: '미사용' },
  2: { option: '사용감 없음' },
  3: { option: '사용감 적음' },
  4: { option: '사용감 많음' },
  5: { option: '고장 / 파손' },
};

export default conditions;
