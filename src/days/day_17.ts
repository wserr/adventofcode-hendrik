import {ProgramManager} from "../manager/program.manager";
import {BasicMap, MapEngine, MapLocation} from "../engine/map.engine";

export namespace Day17 {
    export enum MapPointType {
        SCAFFOLD = 35, OPEN_SPACE = 46,
        CAMERA_LEFT = 60, CAMERA_RIGHT = 62, CAMERA_UP = 94, CAMERA_DOWN = 118, CAMERA_FALLING = 88
    }

    export interface AsciiMapLocation {
        value: MapPointType;
        isScaffold?: boolean;
    }

    export interface VacuumBotInstructions {
        routine: number[];
        A: number[];
        B: number[];
        C: number[];
    }

    export class AsciiBot extends ProgramManager {
        map: BasicMap<AsciiMapLocation> = MapEngine.newMap<AsciiMapLocation>();
        currentX = 0;
        currentY = 0;

        commands: number[] = [];

        line = '';

        getInput = async () => {
            if (this.commands.length) {
                return this.commands.shift();
            }
        }

        writeOutput = (output) => {
            if (output === 10) return this.writeLine();
            this.line += String.fromCharCode(output);
            const location: AsciiMapLocation = {
                value: output,
                isScaffold: output !== MapPointType.OPEN_SPACE && output !== MapPointType.CAMERA_FALLING
            };
            MapEngine.setPointInMap(this.map, this.currentX, this.currentY, location);
            this.currentX++;
        };

        writeLine() {
            console.log(this.line);
            this.line = '';
            this.currentY++;
            this.currentX = 0;
        }
    }

    // find 3 movement functions of each 20 commands max, with which you can parcour through the entire map
    // R,8,R,8,R,4,R,4,R,8,L,6,L,2,R,4,R,4,R,8,R,8,R,8,L,6,L,2
    // determine all possible paths
    // 1 solution is sufficient


    export function splitPathCommandsIntoInstructions(commands: number[]): VacuumBotInstructions {
        const COMMAND_LIMIT = 20;

        interface IPattern {
            count: number;
            length: number;
            indexes: number[],
            commands: number[]
        }

        const patternRecurrenceCount: { [pattern: string]: IPattern } = {};

        const addToPatternCache = (pattern: string, length: number, index: number, commands: number[]) => {
            if (!patternRecurrenceCount[pattern]) patternRecurrenceCount[pattern] = {
                count: 0,
                length: length,
                indexes: [],
                commands
            };
            patternRecurrenceCount[pattern].indexes.push(index);
            patternRecurrenceCount[pattern].count++;
        };
        for (let i = 0; i < commands.length; i++) {
            let currentCommand = `${commands[i]}`;
            let currentCommands = [commands[i]];
            let count = 1;
            addToPatternCache(currentCommand, count, i, currentCommands);
            let maxLength = i + COMMAND_LIMIT;
            if (maxLength > commands.length) maxLength = commands.length;
            for (let j = i + 1; j < maxLength; j++) {
                currentCommand += commands[j];
                currentCommands.push(commands[j]);
                count++;
                addToPatternCache(currentCommand, count, i, currentCommands);
            }
        }
        const startString = commands.reduce((t, v) => t + v, '');

        function getPatterns(restString: string, usedPatterns: IPattern[]): IPattern[] {
            for (const patternStr in patternRecurrenceCount) {

            }
            return;
        }

        // run through all possibilities OR search for all recurring patterns
        // get matching parts
        return null;
    }

    export function getSumOfAlignmentParameters(map: BasicMap<AsciiMapLocation>): number {
        let output = 0;
        // get all alignment parameters
        for (let x = map.minX; x <= map.maxX; x++) {
            for (let y = map.minY; y <= map.maxY; y++) {
                const location = MapEngine.getPoint(map, x, y);
                if (!location?.value.isScaffold) continue;
                if (isIntersection(location, map)) output += calculateAlignmentParameter(location);
                // check if it is a crossing
            }
        }
        return output;
    }

    export function isIntersection(location: MapLocation<AsciiMapLocation>, map: BasicMap<AsciiMapLocation>): boolean {
        const x = location.x;
        const y = location.y;
        return MapEngine.getPoint(map, x + 1, y)?.value.isScaffold
            && MapEngine.getPoint(map, x - 1, y)?.value.isScaffold
            && MapEngine.getPoint(map, x, y + 1)?.value.isScaffold
            && MapEngine.getPoint(map, x, y - 1)?.value.isScaffold;
    }

    export function calculateAlignmentParameter<T>(location: MapLocation<T>): number {
        return location.x * location.y;
    }
}

if (!module.parent) {
    const intCode = [1, 330, 331, 332, 109, 3300, 1102, 1182, 1, 15, 1101, 1455, 0, 24, 1002, 0, 1, 570, 1006, 570, 36, 101, 0, 571, 0, 1001, 570, -1, 570, 1001, 24, 1, 24, 1106, 0, 18, 1008, 571, 0, 571, 1001, 15, 1, 15, 1008, 15, 1455, 570, 1006, 570, 14, 21102, 58, 1, 0, 1106, 0, 786, 1006, 332, 62, 99, 21101, 333, 0, 1, 21102, 1, 73, 0, 1105, 1, 579, 1101, 0, 0, 572, 1101, 0, 0, 573, 3, 574, 101, 1, 573, 573, 1007, 574, 65, 570, 1005, 570, 151, 107, 67, 574, 570, 1005, 570, 151, 1001, 574, -64, 574, 1002, 574, -1, 574, 1001, 572, 1, 572, 1007, 572, 11, 570, 1006, 570, 165, 101, 1182, 572, 127, 102, 1, 574, 0, 3, 574, 101, 1, 573, 573, 1008, 574, 10, 570, 1005, 570, 189, 1008, 574, 44, 570, 1006, 570, 158, 1106, 0, 81, 21101, 0, 340, 1, 1105, 1, 177, 21101, 477, 0, 1, 1105, 1, 177, 21102, 1, 514, 1, 21101, 176, 0, 0, 1106, 0, 579, 99, 21101, 0, 184, 0, 1105, 1, 579, 4, 574, 104, 10, 99, 1007, 573, 22, 570, 1006, 570, 165, 101, 0, 572, 1182, 21101, 0, 375, 1, 21102, 211, 1, 0, 1106, 0, 579, 21101, 1182, 11, 1, 21102, 222, 1, 0, 1106, 0, 979, 21102, 1, 388, 1, 21102, 1, 233, 0, 1106, 0, 579, 21101, 1182, 22, 1, 21102, 1, 244, 0, 1106, 0, 979, 21101, 0, 401, 1, 21102, 255, 1, 0, 1106, 0, 579, 21101, 1182, 33, 1, 21101, 0, 266, 0, 1106, 0, 979, 21102, 1, 414, 1, 21101, 277, 0, 0, 1106, 0, 579, 3, 575, 1008, 575, 89, 570, 1008, 575, 121, 575, 1, 575, 570, 575, 3, 574, 1008, 574, 10, 570, 1006, 570, 291, 104, 10, 21101, 1182, 0, 1, 21101, 313, 0, 0, 1105, 1, 622, 1005, 575, 327, 1101, 0, 1, 575, 21102, 327, 1, 0, 1106, 0, 786, 4, 438, 99, 0, 1, 1, 6, 77, 97, 105, 110, 58, 10, 33, 10, 69, 120, 112, 101, 99, 116, 101, 100, 32, 102, 117, 110, 99, 116, 105, 111, 110, 32, 110, 97, 109, 101, 32, 98, 117, 116, 32, 103, 111, 116, 58, 32, 0, 12, 70, 117, 110, 99, 116, 105, 111, 110, 32, 65, 58, 10, 12, 70, 117, 110, 99, 116, 105, 111, 110, 32, 66, 58, 10, 12, 70, 117, 110, 99, 116, 105, 111, 110, 32, 67, 58, 10, 23, 67, 111, 110, 116, 105, 110, 117, 111, 117, 115, 32, 118, 105, 100, 101, 111, 32, 102, 101, 101, 100, 63, 10, 0, 37, 10, 69, 120, 112, 101, 99, 116, 101, 100, 32, 82, 44, 32, 76, 44, 32, 111, 114, 32, 100, 105, 115, 116, 97, 110, 99, 101, 32, 98, 117, 116, 32, 103, 111, 116, 58, 32, 36, 10, 69, 120, 112, 101, 99, 116, 101, 100, 32, 99, 111, 109, 109, 97, 32, 111, 114, 32, 110, 101, 119, 108, 105, 110, 101, 32, 98, 117, 116, 32, 103, 111, 116, 58, 32, 43, 10, 68, 101, 102, 105, 110, 105, 116, 105, 111, 110, 115, 32, 109, 97, 121, 32, 98, 101, 32, 97, 116, 32, 109, 111, 115, 116, 32, 50, 48, 32, 99, 104, 97, 114, 97, 99, 116, 101, 114, 115, 33, 10, 94, 62, 118, 60, 0, 1, 0, -1, -1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 44, 2, 0, 109, 4, 2101, 0, -3, 587, 20101, 0, 0, -1, 22101, 1, -3, -3, 21102, 1, 0, -2, 2208, -2, -1, 570, 1005, 570, 617, 2201, -3, -2, 609, 4, 0, 21201, -2, 1, -2, 1105, 1, 597, 109, -4, 2105, 1, 0, 109, 5, 2101, 0, -4, 630, 20102, 1, 0, -2, 22101, 1, -4, -4, 21101, 0, 0, -3, 2208, -3, -2, 570, 1005, 570, 781, 2201, -4, -3, 652, 21002, 0, 1, -1, 1208, -1, -4, 570, 1005, 570, 709, 1208, -1, -5, 570, 1005, 570, 734, 1207, -1, 0, 570, 1005, 570, 759, 1206, -1, 774, 1001, 578, 562, 684, 1, 0, 576, 576, 1001, 578, 566, 692, 1, 0, 577, 577, 21101, 0, 702, 0, 1105, 1, 786, 21201, -1, -1, -1, 1105, 1, 676, 1001, 578, 1, 578, 1008, 578, 4, 570, 1006, 570, 724, 1001, 578, -4, 578, 21102, 1, 731, 0, 1105, 1, 786, 1106, 0, 774, 1001, 578, -1, 578, 1008, 578, -1, 570, 1006, 570, 749, 1001, 578, 4, 578, 21101, 0, 756, 0, 1105, 1, 786, 1105, 1, 774, 21202, -1, -11, 1, 22101, 1182, 1, 1, 21102, 1, 774, 0, 1105, 1, 622, 21201, -3, 1, -3, 1105, 1, 640, 109, -5, 2106, 0, 0, 109, 7, 1005, 575, 802, 20101, 0, 576, -6, 21001, 577, 0, -5, 1105, 1, 814, 21102, 0, 1, -1, 21102, 1, 0, -5, 21101, 0, 0, -6, 20208, -6, 576, -2, 208, -5, 577, 570, 22002, 570, -2, -2, 21202, -5, 45, -3, 22201, -6, -3, -3, 22101, 1455, -3, -3, 1202, -3, 1, 843, 1005, 0, 863, 21202, -2, 42, -4, 22101, 46, -4, -4, 1206, -2, 924, 21101, 1, 0, -1, 1106, 0, 924, 1205, -2, 873, 21101, 35, 0, -4, 1105, 1, 924, 2101, 0, -3, 878, 1008, 0, 1, 570, 1006, 570, 916, 1001, 374, 1, 374, 2101, 0, -3, 895, 1102, 2, 1, 0, 1202, -3, 1, 902, 1001, 438, 0, 438, 2202, -6, -5, 570, 1, 570, 374, 570, 1, 570, 438, 438, 1001, 578, 558, 921, 21001, 0, 0, -4, 1006, 575, 959, 204, -4, 22101, 1, -6, -6, 1208, -6, 45, 570, 1006, 570, 814, 104, 10, 22101, 1, -5, -5, 1208, -5, 41, 570, 1006, 570, 810, 104, 10, 1206, -1, 974, 99, 1206, -1, 974, 1102, 1, 1, 575, 21102, 973, 1, 0, 1105, 1, 786, 99, 109, -7, 2106, 0, 0, 109, 6, 21101, 0, 0, -4, 21102, 0, 1, -3, 203, -2, 22101, 1, -3, -3, 21208, -2, 82, -1, 1205, -1, 1030, 21208, -2, 76, -1, 1205, -1, 1037, 21207, -2, 48, -1, 1205, -1, 1124, 22107, 57, -2, -1, 1205, -1, 1124, 21201, -2, -48, -2, 1106, 0, 1041, 21101, 0, -4, -2, 1105, 1, 1041, 21102, 1, -5, -2, 21201, -4, 1, -4, 21207, -4, 11, -1, 1206, -1, 1138, 2201, -5, -4, 1059, 2102, 1, -2, 0, 203, -2, 22101, 1, -3, -3, 21207, -2, 48, -1, 1205, -1, 1107, 22107, 57, -2, -1, 1205, -1, 1107, 21201, -2, -48, -2, 2201, -5, -4, 1090, 20102, 10, 0, -1, 22201, -2, -1, -2, 2201, -5, -4, 1103, 2102, 1, -2, 0, 1106, 0, 1060, 21208, -2, 10, -1, 1205, -1, 1162, 21208, -2, 44, -1, 1206, -1, 1131, 1106, 0, 989, 21102, 439, 1, 1, 1105, 1, 1150, 21101, 477, 0, 1, 1106, 0, 1150, 21101, 514, 0, 1, 21102, 1, 1149, 0, 1105, 1, 579, 99, 21101, 0, 1157, 0, 1105, 1, 579, 204, -2, 104, 10, 99, 21207, -3, 22, -1, 1206, -1, 1138, 1202, -5, 1, 1176, 1201, -4, 0, 0, 109, -6, 2105, 1, 0, 6, 9, 36, 1, 7, 1, 36, 1, 7, 1, 23, 7, 6, 1, 7, 1, 23, 1, 12, 1, 7, 1, 23, 1, 12, 1, 7, 1, 23, 1, 12, 5, 3, 1, 11, 13, 16, 1, 3, 1, 11, 1, 24, 11, 9, 1, 24, 1, 3, 1, 3, 1, 1, 1, 9, 1, 24, 1, 3, 1, 3, 1, 1, 1, 9, 1, 24, 1, 3, 1, 3, 1, 1, 1, 9, 1, 24, 1, 3, 1, 3, 13, 24, 1, 3, 1, 5, 1, 34, 7, 3, 1, 38, 1, 1, 1, 3, 1, 38, 1, 1, 1, 3, 1, 38, 1, 1, 1, 3, 1, 38, 7, 40, 1, 44, 1, 44, 1, 44, 1, 11, 7, 26, 1, 11, 1, 5, 1, 22, 11, 5, 1, 5, 1, 22, 1, 3, 1, 5, 1, 5, 1, 5, 1, 14, 13, 5, 1, 5, 1, 5, 1, 3, 1, 10, 1, 7, 1, 9, 1, 5, 1, 5, 1, 3, 1, 10, 1, 7, 1, 5, 13, 3, 1, 3, 1, 10, 1, 7, 1, 5, 1, 3, 1, 5, 1, 1, 1, 3, 1, 3, 1, 10, 1, 5, 13, 5, 1, 1, 1, 3, 1, 3, 1, 10, 1, 5, 1, 1, 1, 5, 1, 9, 1, 1, 1, 3, 1, 3, 1, 10, 1, 5, 1, 1, 1, 5, 1, 9, 11, 10, 1, 5, 1, 1, 1, 5, 1, 11, 1, 3, 1, 14, 7, 1, 7, 11, 1, 3, 5, 36, 1, 7, 1, 36, 1, 7, 1, 36, 1, 7, 1, 36, 1, 7, 1, 36, 1, 7, 1, 36, 9, 10];

    async function main() {
        const program = new Day17.AsciiBot(intCode);
        await program.executeProgram();
        console.log('part 1', Day17.getSumOfAlignmentParameters(program.map));

        // calculate instructions to give
        intCode[0] = 2;
        const vacuumRobot = new ProgramManager(intCode);
    }

    main().catch(console.log);
}
