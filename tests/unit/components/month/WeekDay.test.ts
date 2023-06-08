import { describe, it, expect } from "vitest";
import { dayInterface } from "../../../../src/typings/interfaces/day.interface";
import { mount } from "@vue/test-utils";
import WeekDay from "../../../../src/components/month/WeekDay.vue";

describe('WeekDay', () => {
  const day: dayInterface = {
    dayName: 'Monday',
    dateTimeString: '2024-01-01 00:00',
    events: [],
  }

  it('should display the day name', () => {
    const underTest = mount(WeekDay, {
      props: { day }
    })
    expect(underTest.text()).toContain('Monday');
  });
});
