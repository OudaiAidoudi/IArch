/**
 * this model specifies the format to exchange bonus-salaries
 */
export class Bonus {
    constructor(
        public _id: string,
        public year: number,
        public value: number,
        public remark: string,
        public verified: string,
        public salesManID: number
    ) {  }
}
