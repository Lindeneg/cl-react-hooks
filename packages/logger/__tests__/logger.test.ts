import Logger, { Severity } from '../src';
import { EmptyObj } from '@lindeneg/types';

function json(obj: EmptyObj) {
  return JSON.stringify(obj, null, 2);
}

describe('Test Suite: @lindeneg/logger', () => {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const mockedLog = (...output: unknown[]) => consoleOutput.push(...output);
  const mockedWarn = (...output: unknown[]) => consoleOutput.push(...output);
  const mockedError = (...output: unknown[]) => consoleOutput.push(...output);
  let consoleOutput: unknown[] = [];
  beforeEach(() => {
    console.log = mockedLog;
    console.warn = mockedWarn;
    console.error = mockedError;
    consoleOutput = [];
  });
  afterEach(() => {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  });

  test('can print to stdout with debug color', () => {
    const { print } = new Logger('someOrigin');
    const ts = Date.now();

    print('some error', Severity.Debug, '', ts);
    expect(consoleOutput[0]).toBe('\x1b[0m%s\x1b');
    expect(consoleOutput[1]).toBe(
      json({
        origin: 'someOrigin',
        severity: Severity.Debug,
        ts,
        msg: 'some error',
      })
    );
  });

  test('can print to stdout with warn color', () => {
    const { print } = new Logger('someOrigin');
    const ts = Date.now();

    print('some error', Severity.Warn, '', ts);
    expect(consoleOutput[0]).toBe('\x1b[33m%s\x1b');
    expect(consoleOutput[1]).toBe(
      json({
        origin: 'someOrigin',
        severity: Severity.Warn,
        ts,
        msg: 'some error',
      })
    );
  });

  test('can print to stdout with error color', () => {
    const { print } = new Logger('someOrigin');
    const ts = Date.now();

    print('some error', Severity.Error, '', ts);
    expect(consoleOutput[0]).toBe('\x1b[31m%s\x1b');
    expect(consoleOutput[1]).toBe(
      json({
        origin: 'someOrigin',
        severity: Severity.Error,
        ts,
        msg: 'some error',
      })
    );
  });

  test('can print to stdout with extended object', () => {
    const { print } = new Logger('someOrigin');
    const ts = Date.now();

    print(
      { msg: 'some error', context: 'something', type: 2 },
      Severity.Error,
      '',
      ts
    );
    expect(consoleOutput[0]).toBe('\x1b[31m%s\x1b');
    expect(consoleOutput[1]).toBe(
      json({
        origin: 'someOrigin',
        severity: Severity.Error,
        ts,
        msg: 'some error',
        context: 'something',
        type: 2,
      })
    );
  });

  test('can print to stdout with extended origin', () => {
    const { print } = new Logger('someOrigin');
    const ts = Date.now();

    print('some-error', Severity.Error, 'someFunctionName', ts);
    expect(consoleOutput[0]).toBe('\x1b[31m%s\x1b');
    expect(consoleOutput[1]).toBe(
      json({
        origin: 'someOrigin::someFunctionName',
        severity: Severity.Error,
        ts,
        msg: 'some-error',
      })
    );
  });

  test('can use log with correctly', () => {
    const { log } = new Logger('someOrigin');
    const ts = Date.now();

    log('some-message', 'someFunctionName', ts);
    expect(consoleOutput[0]).toBe('\x1b[0m%s\x1b');
    expect(consoleOutput[1]).toBe(
      json({
        origin: 'someOrigin::someFunctionName',
        severity: Severity.Debug,
        ts,
        msg: 'some-message',
      })
    );
  });

  test('can use warn correctly', () => {
    const { warn } = new Logger('someOrigin');
    const ts = Date.now();

    warn('some-warning', 'someFunctionName', ts);
    expect(consoleOutput[0]).toBe('\x1b[33m%s\x1b');
    expect(consoleOutput[1]).toBe(
      json({
        origin: 'someOrigin::someFunctionName',
        severity: Severity.Warn,
        ts,
        msg: 'some-warning',
      })
    );
  });

  test('can use error correctly', () => {
    const { error } = new Logger('someOrigin');
    const ts = Date.now();

    error('some-error', 'someFunctionName', ts);
    expect(consoleOutput[0]).toBe('\x1b[31m%s\x1b');
    expect(consoleOutput[1]).toBe(
      json({
        origin: 'someOrigin::someFunctionName',
        severity: Severity.Error,
        ts,
        msg: 'some-error',
      })
    );
  });

  test('respects specified guard function', () => {
    const { print } = new Logger('someOrigin', () => false);
    print('some-error', Severity.Debug);
    expect(consoleOutput.length).toBe(0);
  });
});
