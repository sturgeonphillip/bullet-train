import { getTodayKey } from '../../src/utils/dateUtils';

describe('getTodayKey()', () => {
  beforeAll(() => {
    // pretend it's 11:59 pm PDT on July 5, 2025
    jest.useFakeTimers().setSystemTime(new Date('2025-07-05T23:59:00-7:00'));
  });

  it('returns July 05 when in PDT', () => {
    expect(getTodayKey()).toBe('2025-07-05');
  });

  afterAll(() => jest.useRealTimers());
});
