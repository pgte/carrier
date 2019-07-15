import { EventEmitter } from 'events';

interface CarrierReadable extends EventEmitter {
    setEncoding?(encoding?: string): this;
}

type LineListener = (line: string) => void;

declare class Carrier extends EventEmitter {
    public reader: CarrierReadable;

    public constructor(reader: CarrierReadable,
                       listener?: LineListener,
                       encoding?: string,
                       separator?: string | RegExp);

    public addListener(event: string, listener: (...args: any[]) => void): this;
    public addListener(event: 'line', listener: LineListener): this;
    public addListener(event: 'end', listener: () => void): this;

    public emit(event: string | symbol, ...args: any[]): boolean;
    public emit(event: 'line', data: string): boolean;
    public emit(event: 'end'): boolean;

    public on(event: string, listener: (...args: any[]) => void): this;
    public on(event: 'line', listener: LineListener): this;
    public on(event: 'end', listener: () => void): this;

    public once(event: string, listener: (...args: any[]) => void): this;
    public once(event: 'line', listener: LineListener): this;
    public once(event: 'end', listener: () => void): this;

    public prependListener(event: string, listener: (...args: any[]) => void): this;
    public prependListener(event: 'line', listener: LineListener): this;
    public prependListener(event: 'end', listener: () => void): this;

    public prependOnceListener(event: string, listener: (...args: any[]) => void): this;
    public prependOnceListener(event: 'line', listener: LineListener): this;
    public prependOnceListener(event: 'end', listener: () => void): this;
}

export declare function carry(reader: CarrierReadable,
                              listener?: LineListener,
                              encoding?: string,
                              separator?: string | RegExp): Carrier;
