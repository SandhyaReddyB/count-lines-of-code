import { Component, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('f') codeForm: NgForm;

  codeInput: string;
  lineCount: number;
  isValidCodeLine: boolean;
  isBlockComment: boolean;

  /*
  * function to trigger line count once form is submitted
  */
  onSubmit(form: NgForm) {
    this.lineCount = 0;
    this.isBlockComment = false;
    this.codeInput = this.codeForm.value.linesofcode;
    this.countLinesOfCode(this.codeInput);
  }

  /*
  * function to count lines of code
  */
  countLinesOfCode(codeInput) {
    if (codeInput.length > 0) {
      let codelines = [];
      codelines = this.codeInput.split('\n');
      let codelength = codelines.length;
      for (var i = 0; i < codelength; i++) {
        this.isValidCodeLine = this.validateCode(codelines[i]);
        this.countline();
        while (this.isBlockComment) {
          if (i < codelength - 1) {
            i = i + 1;
            this.isBlockComment = this.checkEndOfBlockComment(codelines[i]);
          }
          else {
            this.isBlockComment = false;
          }
        }
      }
    }
  }

  /*
  * function to count lines of validated code
  */
  countline() {
    if (this.isValidCodeLine) {
       this.lineCount = this.lineCount + 1;
    }
  }

  /*
  * function to validate if the line is actual Java code
  */
  validateCode(str) {
    let isValidCode: boolean = true;
    str = str.trim();
    //check if the line has only empty spaces or tabs
    if (!(/\S/.test(str)) || str.length === 0) {
      isValidCode = false;
    }
    else {
      //check if the line is a single line comment
      if (str.startsWith('\/\/')) {
        isValidCode = false;
      }
      //check if the line is start of a block line comment
      else if (str.startsWith('\/*')) {
        isValidCode = false;
      }
      //check if the line is a block comment '/* comment */' or is only end of block comment '*/'
      else if (str.startsWith('\/*') && str.endsWith('*\/') || str.startsWith('*\/') && str.endsWith('*\/')) {
        isValidCode = false;
      }
      //check if the line has block line comment, exclude '/*' within quotes
      if (this.testMultipleBlockComments(str) > 0 || str.startsWith('\/*') || str.endsWith('\/*')) {
        this.isBlockComment = true;
      }
    }
    return isValidCode;
  }

  /*
  * function to check end of block comment
  */
  checkEndOfBlockComment(str) {
    if (str.length > 0) {
      str = str.trim();
      if (str.includes('*\/')) {
        if (str.endsWith('*\/')) {
          return false;
        }
        else if (str.endsWith('*\/') && str.startsWith('*\/')) {
          return false;
        }
        else {
          this.isValidCodeLine = this.validateCode(str);
          this.countline();
        }
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  }

  /*
  * function to check if a single line contains multiple block comments and verify if its closed or not,
  * exclude block comments in java strings
  */
  testMultipleBlockComments(str) {
    let a, b;
    if (str.includes('\/*')) {
      var str1 = str.split('/*');
      str1.forEach(check);
      let l1 = (str1.length) - (b - a);
      var str2 = str.split('*/');
      str2.forEach(check);
      let l2 = (str2.length) - (b - a);
      return l1 - l2;
    }
    function check(item, index) {
      if (item.includes('("')) { a = index + 1 }
      if (item.includes('")')) { b = index + 1 }
    }
  }

  /*
  * Reset the form
  */
  onReset() {
    this.lineCount = -1;
    this.codeForm.reset();
  }
}
