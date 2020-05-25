import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-view-result',
  templateUrl: './view-result.component.html',
  styleUrls: ['./view-result.component.scss']
})
export class ViewResultComponent implements OnInit {

  userProfile: any;
  userEmail: string;
  questionsData: any;
  questionsCount: number = 0;
  correctAnswersCount: number = 0;
  attemptedQuestionsCount: number = 0;
  percentage: number = 0;
  passingCutOff: number = 35;
  grade: String;
  resultNotFound: boolean;
  usersCollection: any;

  constructor( public activatedRoute: ActivatedRoute, public angularFirestore: AngularFirestore ) {
    this.usersCollection = this.angularFirestore.collection('users');

    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
      this.userEmail = params["emailId"];
    });

    const userRef = this.usersCollection.doc( this.userEmail );
    userRef.get().toPromise().then((docSnapshot) => {
      if ( !docSnapshot.exists ) {
          this.resultNotFound = true;
          return;
      } else {
        firebase.firestore().collection( 'users' ).where( firebase.firestore.FieldPath.documentId(), '==', this.userEmail ).get()
        .then( result => {
          result.forEach( element => {
            this.userProfile = element.data();
            this.questionsData = this.userProfile['examQuestions'];
            this.calculateMarks( this.questionsData );
          });
        })
      }
    })
  }

  ngOnInit() {
  }

  calculateMarks( questionsData ) {
    this.questionsCount = questionsData.length;
    let promise = new Promise( ( resolve, reject ) => {
      questionsData.forEach( ( element, index, array ) => {
        if( element['correct_option'] == element['selectedOption'] ) {
          this.correctAnswersCount++ ;
        }
        if( null != element['selectedOption'] ) {
          this.attemptedQuestionsCount++;
        }
        if( index == array.length-1 ) resolve();
      });
    });

    promise.then( () => {
      this.percentage = Math.round( this.correctAnswersCount/this.questionsCount*100 );
      if( this.percentage > this.passingCutOff ) {
        this.grade = 'Passed';
      } else {
        this.grade = 'Failed'
      }
    });
  }

}
