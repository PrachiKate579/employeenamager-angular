import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from './employee';
import { EmployeeserviceService } from './employeeservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 public employees:Employee[]=[];
 public addEmployee!: Employee;
 public editEmployee!: Employee;
  public deleteEmployee!: Employee;

constructor(private employeeservice:EmployeeserviceService){}

ngOnInit(): void {
  this.getEmployees();
 
}

getEmployees()
{
  console.log("inside getemployee")
  this.employeeservice.getEmployee().subscribe(data => this.employees =data);
  
}
public onAddEmloyee(addForm: NgForm): void {
  const button = document.getElementById('add-employee-form');

// 👇️ using optional (?.) chaining
button?.addEventListener('click', () => {
  console.log('button clicked');
});
  //  document.getElementById('add-employee-form').click() ;
  this.employeeservice.addEmployee(addForm.value).subscribe(
    (response: Employee) => {
      console.log(response);
      this.getEmployees();
      addForm.reset();
      confirm("Employee added successfully");
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
      addForm.reset();
    }
  );
}

public onUpdateEmloyee(employee: Employee): void {
  this.employeeservice.updateEmployee(employee).subscribe(
    (response: Employee) => {
      console.log(response);
      this.getEmployees();
      confirm("Employee updated successfully");
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public onDeleteEmloyee(employeeId: number): void {
  this.employeeservice.deleteEmployee(employeeId).subscribe(
    (response: void) => {
      console.log(response);
      this.getEmployees();
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}

public searchEmployees(key: string): void {
  console.log(key);
  const results: Employee[] = [];
  for (const employee of this.employees) {
    if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
    || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
    || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
    || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
      results.push(employee);
    }
  }
  this.employees = results;
  if (results.length === 0 || !key) {
    this.getEmployees();
  }
}

public onOpenModal(employee: Employee, mode: string): void {
  const container = document.getElementById('main-container');
  const button = document.createElement('button');
  button.type = 'button';
  button.style.display = 'none';
  button.setAttribute('data-toggle', 'modal');
  if (mode === 'add') {
    button.setAttribute('data-target', '#addEmployeeModal');
  }
  if (mode === 'edit') {
    this.editEmployee = employee;
    button.setAttribute('data-target', '#updateEmployeeModal');
  }
  if (mode === 'delete') {
    this.deleteEmployee = employee;
    button.setAttribute('data-target', '#deleteEmployeeModal');
  }
  container?.appendChild(button);
  button.click();
}

}
