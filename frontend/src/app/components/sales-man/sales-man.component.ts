import {Component, OnInit} from '@angular/core';
import {SalesManService} from '../../services/sales-man.service';
import {SalesMan} from '../../models/SalesMan';
import {EvaluationRecordService} from '../../services/evaluation-record.service';
import {EvaluationRecord} from '../../models/EvaluationRecord';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-sales-man',
    templateUrl: './sales-man.component.html',
    styleUrls: ['./sales-man.component.css']
})
export class SalesManComponent implements OnInit {

    displayedColumns = ['_id', 'firstname', 'lastname', 'jobTitle', 'unit', 'actions'];
    displayedColumnsEvaluatinRecord = [ 'year_2', 'goal_2', 'targetValue_2', 'actualValue_2', 'bonus_2'];
    dataSource: SalesMan[] = [];
    evaluationrecords: EvaluationRecord[] = [];
    show = false;
    closeResult = '';
    allowedSync = false;
    constructor(
        private salesManService: SalesManService,
        private evaluationRecordService: EvaluationRecordService,
        private modalService: NgbModal,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.fetchSalesmans();
        this.userService.getOwnUser().subscribe((user): void => {
            if (user.role === 'HR' || user.isAdmin) {
                this.allowedSync = true;
            }
        });
    }

    fetchSalesmans(): void{
        this.salesManService.getAllSalesMan().subscribe((response): void => {
            if (response.status === 200){
                this.dataSource = response.body;
            }
        });
    }
    deleteMethod(row: SalesMan): void {
        if (confirm('Are you sure to delete ' + row.firstname)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.salesManService.deleteSalesman(row._id).subscribe((): void => {
                this.fetchSalesmans();
            });
        }
    }


    showSalesMan(content: any, row: SalesMan): void{
        (this.evaluationRecordService.getEvaluationRecordBySalesManID(row._id)).subscribe((response): void => {
            if (response.status === 200){
                this.evaluationrecords = response.body;
                this.show = true;
                this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result): void => {
                    this.closeResult = `Closed with: ${String(result)}`;

                }, (): void => {
                });
            }
        });

    }

    getBonus(target: number, actual: number): number {
        if (actual > target) {
            return 100;
        } else if (actual === target) {
            return 50;
        } else {
            return 20;
        }
    }

}
