import {Component, OnInit} from '@angular/core';
import {Bonus} from '../../models/Bonus';
import {BonusService} from '../../services/bonus.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-bonuses',
    templateUrl: './bonuses.component.html',
    styleUrls: ['./bonuses.component.css']
})
export class BonusesComponent implements OnInit {
    bonuses: Bonus[] = [];
    displayedColumns = ['year', 'value', 'remark','salesManID', 'actions'];
    selectedYear: number = new Date().getFullYear();
    loading = false;
    error: string | null = null;
    constructor(
        private bonusService: BonusService,
        private spinnerService: NgxSpinnerService
    ) { }

    ngOnInit(): void {
        void this.spinnerService.show();
        this.getBonuses();
    }

    getBonuses(): void {
        this.bonusService.getBonuses()
            .subscribe((bonuses): void => {
                this.bonuses = bonuses.body;
                setTimeout((): void => {
                    /** spinner ends after 500 milliseconds */
                    void this.spinnerService.hide();
                }, 500);
            });
    }

    add(year: number): void {
        if (!year) { return; }
        this.bonusService.addBonus({year} as Bonus)
            .subscribe((bonus): void => {
                this.bonuses.push(bonus);
            });
    }

    delete(bonus: Bonus): void {
        if (confirm('Are you sure to delete this bonus?')) {
            this.bonuses = this.bonuses.filter((b): boolean => b !== bonus);
            this.bonusService.deleteBonus(bonus._id)
                .subscribe();
        }
    }

    calculateBonuses() {
        this.loading = true;
        this.error = '';

        this.bonusService.calculateAllBonuses(this.selectedYear)
            .subscribe({
                next: (response) => {
                    if (response.body) {
                        this.bonuses = response.body;
                    }
                    this.loading = false;
                },
                error: (error) => {
                    this.error = 'Failed to calculate bonuses. Please try again.';
                    this.loading = false;
                    console.error('Error calculating bonuses:', error);
                }
            });
    }
}
