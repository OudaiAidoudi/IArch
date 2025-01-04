class EvaluationRecord {
    constructor(
        goalDescription,
        targetValue,
        actualValue,
        year,
        salesManID
    ) {
        this.goalDescription = goalDescription;
        this.targetValue = targetValue;
        this.actualValue = actualValue;
        this.year = year;
        this.salesManID= salesManID;
    }
}

module.exports = EvaluationRecord;