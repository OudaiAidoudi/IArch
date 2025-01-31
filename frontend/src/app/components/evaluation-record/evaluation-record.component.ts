import {Component, OnInit} from '@angular/core';
import {EvaluationRecordService} from '../../services/evaluation-record.service';
import {SalesManService} from '../../services/sales-man.service';
import {Router} from '@angular/router';
import {EvaluationRecord, Goal} from '../../models/EvaluationRecord';
import {SalesMan} from '../../models/SalesMan';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-evaluation-record',
    templateUrl: './evaluation-record.component.html',
    styleUrls: ['./evaluation-record.component.css']
})



export class EvaluationRecordComponent implements OnInit {
    closeResult = '';
    displayedColumns = ['salesMan', 'year', 'goal', 'targetValue', 'actualValue', 'actions'];
    evaluationrecords: EvaluationRecord[] = [];
    goals: Goal[] = [];
    salesMenArray: SalesMan[] = [];
    evaluationrecord: EvaluationRecord = new EvaluationRecord();

    /* evaluationRecord: EvaluationRecord= new EvaluationRecord( _id: number;
       goalDescription: string;
       targetValue: string;
       actualValue: string;
       year: string;
       salesManID: string);*/
    activeEvaluationRecord: EvaluationRecord = new EvaluationRecord();

    targetValue: string;
    actualValue: string;
    constructor(private router: Router,
                private evaluationRecordService: EvaluationRecordService,
                private salesManService: SalesManService,
                private modalService: NgbModal) { }

    selectedValue: string;
    selectedCar: string;

    ngOnInit(): void {
        this.fetchEvaluationRecords();
        this.getGoals();
        this.getSalesMen();
    }

    fetchEvaluationRecords(): void{
        this.evaluationRecordService.getAllEvaluationRecord().subscribe((response): void => {
            if (response.status === 200){
                this.evaluationrecords = response.body;
                for (const evaluation of this.evaluationrecords) {
                    evaluation.salesMan = evaluation.salesMan[0] as SalesMan;
                }
            }
        });
    }

    getSalesMen(): void{
        this.salesManService.getAllSalesMan().subscribe((response): void => {
            if (response.status === 200){
                this.salesMenArray = response.body;
            }
        });
    }

    getGoals(): void{
        this.evaluationRecordService.getGoals().subscribe((response): void => {
            if (response.status === 200){
                this.goals = response.body;
            }
        });
    }
    deleteMethod(row: EvaluationRecord): void {
        if (confirm('Are you sure to delete evaluation record ' + String(row._id))) {
            this.evaluationRecordService.deleteEvaluationRecord(row._id).subscribe((): void => {
                this.fetchEvaluationRecords();
            }, (): void => {
                this.fetchEvaluationRecords();
            });
            this.fetchEvaluationRecords();
        }
    }

    open(content: any, row: EvaluationRecord): void {
        if (row)
        {
            this.evaluationrecord.actualValue = row.actualValue;
            this.evaluationrecord.targetValue = row.targetValue;
            this.evaluationrecord.year = row.year;
            this.evaluationrecord.goalDescription = row.goalDescription;
            this.evaluationrecord.salesManID = row.salesManID;
            this.evaluationrecord.salesMan = row.salesMan;
            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result: any): void => {
                this.closeResult = `Closed with: ${String(result)}`;
                this.evaluationrecord.salesManID = this.evaluationrecord.salesMan._id;
                this.evaluationRecordService.updateEvaluationRecord(row._id, this.evaluationrecord).subscribe((): void => {
                    this.fetchEvaluationRecords();
                }, (): void => {
                    this.fetchEvaluationRecords();
                });
            }, (reason): void => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
        else {
            this.evaluationrecord = new EvaluationRecord();
            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result): void => {
                this.closeResult = `Closed with: ${String(result)}`;
                this.evaluationrecord.salesManID = this.evaluationrecord.salesMan._id;
                delete this.evaluationrecord.salesMan;
                this.evaluationRecordService.saveEvaluationRecord(this.evaluationrecord).subscribe((): void => {
                    this.fetchEvaluationRecords();
                }, (): void => {
                    this.fetchEvaluationRecords();
                });
            }, (reason): void => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${String(reason)}`;
        }
    }

    sortBy(list?: SalesMan[], attribute?: string): SalesMan[] {
        if (list) {
            return list.sort((a, b): any => a[attribute] > b[attribute] ? 1 : b[attribute] > a[attribute] ? -1 : 0);
        }
    }

    compareSalesMen(o1: SalesMan, o2: SalesMan): boolean {
        return o1.fullName === o2.fullName;
    }

}
