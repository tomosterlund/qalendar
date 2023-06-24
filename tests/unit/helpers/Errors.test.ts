import { describe, it, expect, vi } from "vitest";
import Errors from "../../../src/helpers/Errors";

describe('Errors/checkEventProperties', () => {
  it('should warn if "id" is missing', () => {
    const eventWithoutId = {
      title: 'test',
      time: {
        start: '2020-01-01',
        end: '2020-01-02'
      }
    }

    const consoleWarnSpy = vi.spyOn(console, 'warn');
    Errors.checkEventProperties(eventWithoutId);
    expect(consoleWarnSpy).toHaveBeenCalledWith(Errors.MISSING_ID_WARNING);
  })

  it('should warn if "title" is missing', () => {
    const eventWithoutTitle = {
      id: 1,
      time: {
        start: '2020-01-01',
        end: '2020-01-02'
      }
    }

    const consoleWarnSpy = vi.spyOn(console, 'warn');
    Errors.checkEventProperties(eventWithoutTitle);
    expect(consoleWarnSpy).toHaveBeenCalledWith(Errors.MISSING_TITLE_WARNING);
  });

  it('should warn if "time.start" is missing', () => {
    const eventWithoutTimeStart = {
      id: 1,
      title: 'test',
      time: {
        end: '2020-01-02'
      }
    }

    const consoleWarnSpy = vi.spyOn(console, 'warn');
    Errors.checkEventProperties(eventWithoutTimeStart);
    expect(consoleWarnSpy).toHaveBeenCalledWith(Errors.MISSING_TIME_START_WARNING);
  });

  it('should warn if "time.end" is missing', () => {
    const eventWithoutTimeEnd = {
      id: 1,
      title: 'test',
      time: {
        start: '2020-01-01'
      }
    }

    const consoleWarnSpy = vi.spyOn(console, 'warn');
    Errors.checkEventProperties(eventWithoutTimeEnd);
    expect(consoleWarnSpy).toHaveBeenCalledWith(Errors.MISSING_TIME_END_WARNING);
  })

  it('should warn if "time" is missing', () => {
    const eventWithoutTime = {
      id: 1,
      title: 'test'
    }

    const consoleWarnSpy = vi.spyOn(console, 'warn');
    Errors.checkEventProperties(eventWithoutTime);
    expect(consoleWarnSpy).toHaveBeenCalledWith(Errors.MISSING_TIME_WARNING);
  })

  it('should warn if time.start is not a valid date string', () => {
    const eventWithInvalidTimeStart = {
      id: 1,
      title: 'test',
      time: {
        start: '2022-01-01 23:00:00',
        end: '2020-01-02'
      }
    }

    const consoleWarnSpy = vi.spyOn(console, 'warn');
    Errors.checkEventProperties(eventWithInvalidTimeStart);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `${Errors.PREFIX} event property 'time.start' expects a string formatted like 'YYYY-MM-DD hh:mm', or 'YYYY-MM-DD', received ${eventWithInvalidTimeStart.time.start} \n${Errors.SUFFIX}`
    );
  })

  it('should warn if time.end is not a valid date string', () => {
    const eventWithInvalidTimeEnd = {
      id: 1,
      title: 'test',
      time: {
        start: '2020-01-01',
        end: '2022-01-01 23:00:00'
      }
    }

    const consoleWarnSpy = vi.spyOn(console, 'warn');
    Errors.checkEventProperties(eventWithInvalidTimeEnd);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `${Errors.PREFIX} event property 'time.end' expects a string formatted like 'YYYY-MM-DD hh:mm',  or 'YYYY-MM-DD', received ${eventWithInvalidTimeEnd.time.end} \n${Errors.SUFFIX}`
    );
  })
});
