export declare class RadarChart {
    axises: any[];
    labels: any[];
    context: CanvasRenderingContext2D;
    dimension: any[];
    values: any[];
    size: number;
    radius: number;
    bgRadius: number;
    constructor(context: CanvasRenderingContext2D, dimension: any[], values: any[], size: number);
    get num(): number;
    get angle(): number;
    calculate(): {
        title: string;
        x: number;
        y: number;
    }[];
    drawValue(): void;
    drawScale(): void;
    drawDimensions(): void;
    drawBg(): void;
}
