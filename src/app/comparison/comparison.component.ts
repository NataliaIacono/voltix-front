import { Component, inject, OnInit } from '@angular/core';
import { ReportDownloadComponent } from '../invoice-measurements/measurements/components/report-download/report-download.component';
import { ReportService } from '../invoice-measurements/measurements/services/report-service/report.service';
import { DownloadToastComponent } from '../invoice-measurements/measurements/components/download-toast/download-toast.component';
import { DownloadingToastComponent } from '../invoice-measurements/measurements/components/downloading-toast/downloading-toast.component';
import { InvMesHeaderComponent } from '../invoice-measurements/shared/header/inv-mes-header.component';
import { MeasurementService } from '../invoice-measurements/measurements/services/measurement-service/measurement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ComparisonResponse } from '../core/model/comparison';

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [
    CommonModule,
    ReportDownloadComponent,
    DownloadToastComponent,
    DownloadingToastComponent,
    InvMesHeaderComponent,
  ],
  providers: [DatePipe],
  templateUrl: './comparison.component.html',
  styleUrl: './comparison.component.css'
})
export class ComparisonComponent  implements OnInit {
  reportService = inject(ReportService);
  measurementService = inject(MeasurementService);
  route = inject(ActivatedRoute);
  datePipe = inject(DatePipe);
  router = inject(Router);

  comparisonMesInv!: ComparisonResponse;
  modalDataNotFound: boolean = false;

  ngOnInit() {
    this.getComparison();
  }

  get comparisonId() {
    return Number(this.route.snapshot.paramMap.get('comparisonId'));
  }

  getComparison(): void {
    this.measurementService.getComparisonDetails(this.comparisonId).subscribe({
      next: (data) => {
        this.comparisonMesInv = data;
      },
      error: (err) => {
        this.openModalDataNotFound();
        console.error('Error al obtener la comparación:', err);
      },
    });
  }
  

  get dataLoaded() {
    return this.datePipe.transform(
      this.comparisonMesInv?.created_at,
      'dd/MM/YYYY'
    );
  }

  get invoiceId(){
    return this.comparisonMesInv?.invoice_id;
  }

  get measurementId(){
    return this.comparisonMesInv?.measurement_id;
  }

  get invoicePeriod(): string {
    const start = this.datePipe.transform(
      this.comparisonMesInv?.result.periodo_facturacion.fecha_inicio_factura,
      'dd/MM/YYYY'
    );
    const end = this.datePipe.transform(
      this.comparisonMesInv?.result.periodo_facturacion.fecha_fin_factura,
      'dd/MM/YYYY'
    );
    return `${start} - ${end}`;
  }

  get measurementPeriod(): string {
    const start = this.datePipe.transform(
      this.comparisonMesInv?.result.periodo_facturacion.fecha_inicio_medicion,
      'dd/MM/YYYY'
    );
    const end = this.datePipe.transform(
      this.comparisonMesInv?.result.periodo_facturacion.fecha_fin_medicion,
      'dd/MM/YYYY'
    );
    return `${start} - ${end}`;
  }

  get periodMatches(){
    return this.comparisonMesInv?.result.periodo_facturacion.coincide_fechas
  }

  get invoicedDays() {
    return this.comparisonMesInv?.result.periodo_facturacion.dias_facturados;
  }

  get invoiceConsumption() {
    return this.comparisonMesInv?.result.detalles_consumo.total_consumption_kwh
      .invoice;
  }

  get measurementConsumption() {
    return this.comparisonMesInv?.result.detalles_consumo.total_consumption_kwh
      .measurement;
  }

  get consumptionMatches(){
    return this.comparisonMesInv?.result.detalles_consumo.total_consumption_kwh.matches;
  }

  get invoiceAmount() {
    return this.comparisonMesInv?.result.total_a_pagar.factura;
  }

  get measurementAmount() {
    return this.comparisonMesInv?.result.total_a_pagar.calculo_medicion;
  }

  get amountMatches() {
    return this.comparisonMesInv?.result.total_a_pagar.coincide_total;
  }

  // showModal() {
  //   this.reportService.showModal();
  // }

  showModal() {
    const comparisonId = this.comparisonId;
    if (comparisonId) {
      this.reportService.downloadReport(comparisonId); // Pass the ID to the service
    } else {
      console.error('Comparison ID is not available.');
    }
  }

  openModalDataNotFound(){
    this.modalDataNotFound = true;
  }

  closeModalDataNotFound(){
    this.modalDataNotFound = false;
    this.router.navigate(['/measurement-search']);
  }


}
