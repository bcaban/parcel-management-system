import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ParcelService} from '../../services/parcel.service';
import {Parcel} from '../../common/parcel';
import {NGXLogger} from 'ngx-logger';
import * as moment from 'moment';
import 'moment-duration-format';
import {ParcelStatus} from '../../common/parcel-status';
import {ParcelStatusTranslatorService} from '../../services/parcel-status-translator.service';

@Component({
  selector: 'app-parcel',
  templateUrl: './parcel.component.html',
  styleUrls: ['./parcel.component.css']
})
export class ParcelComponent implements OnInit {
  parcelId: string = 'not_found';
  parcel: Parcel = null;
  statusDelivered = ParcelStatus.DELIVERED;
  statusContact = ParcelStatus.MISSING_IN_ACTION;
  translatedParcelStatus = '???';
  daysToDeliver: number = 0;
  expectedParcelDeliveryDate: Date = new Date();
  wasParcelSearched = false;
  wasParcelFound = false;

  constructor(private route: ActivatedRoute, private parcelService: ParcelService,
              private parcelStatusTranslator: ParcelStatusTranslatorService, private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      if (this.route.snapshot.paramMap.has('parcelId')) {
        this.getParcel();
      }
    });
  }

  private getParcel(): void {
    this.parcelId = this.route.snapshot.paramMap.get('parcelId');

    this.logger.info('Getting parcel: {}', this.parcelId);

    this.parcelService.getParcel(this.parcelId).subscribe(
      parcel => {
        this.wasParcelSearched = true;
        this.wasParcelFound = true;

        this.logger.info('Received parcel: {}', parcel);

        this.parcel = parcel;
        this.setExpectedDeliverTime(this.parcel);
        this.translatedParcelStatus = this.parcelStatusTranslator.translateStatusToPolish(ParcelStatus[this.parcel.status]);
      },
      error => {
        this.wasParcelSearched = true;
        this.wasParcelFound = false;

        this.logger.info('Cannot find parcel: {}', this.parcelId);
      }
    );
  }

  private setExpectedDeliverTime(parcel: Parcel): void {
    const timeToDeliver = moment.duration(parcel.timeToDeliver);

    this.daysToDeliver = timeToDeliver.asDays();
    this.expectedParcelDeliveryDate.setDate(new Date().getDate() + this.daysToDeliver);
  }
}
