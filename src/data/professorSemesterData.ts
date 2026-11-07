/**
 * Ground Truth Dataset extracted directly from the Professor's 10-table Excel workbook.
 * Contains 29 students, 9 assessments (HW1..HW5, Q1..Q4) with exact questions & scores,
 * and the expected semester summary from Sheet 10.
 */

import { Assignment, StudentAssignmentGrade, User } from '../types';

export const PROFESSOR_STUDENTS: User[] = [
  {
    "id": "stu_4012019001",
    "studentId": "4012019001",
    "full_name": "Student 01",
    "firstName": "Student",
    "lastName": "01",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019001",
    "studentId": "4032019001",
    "full_name": "Student 02",
    "firstName": "Student",
    "lastName": "02",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4012019005",
    "studentId": "4012019005",
    "full_name": "Student 03",
    "firstName": "Student",
    "lastName": "03",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019005",
    "studentId": "4032019005",
    "full_name": "Student 04",
    "firstName": "Student",
    "lastName": "04",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019006",
    "studentId": "4032019006",
    "full_name": "Student 05",
    "firstName": "Student",
    "lastName": "05",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019008",
    "studentId": "4032019008",
    "full_name": "Student 06",
    "firstName": "Student",
    "lastName": "06",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019010",
    "studentId": "4032019010",
    "full_name": "Student 07",
    "firstName": "Student",
    "lastName": "07",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019011",
    "studentId": "4032019011",
    "full_name": "Student 08",
    "firstName": "Student",
    "lastName": "08",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019013",
    "studentId": "4032019013",
    "full_name": "Student 09",
    "firstName": "Student",
    "lastName": "09",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4033333328",
    "studentId": "4033333328",
    "full_name": "Student 10",
    "firstName": "Student",
    "lastName": "10",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4043333044",
    "studentId": "4043333044",
    "full_name": "Student 11",
    "firstName": "Student",
    "lastName": "11",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019015",
    "studentId": "4032019015",
    "full_name": "Student 12",
    "firstName": "Student",
    "lastName": "12",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4043333073",
    "studentId": "4043333073",
    "full_name": "Student 13",
    "firstName": "Student",
    "lastName": "13",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019016",
    "studentId": "4032019016",
    "full_name": "Student 14",
    "firstName": "Student",
    "lastName": "14",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019017",
    "studentId": "4032019017",
    "full_name": "Student 15",
    "firstName": "Student",
    "lastName": "15",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019018",
    "studentId": "4032019018",
    "full_name": "Student 16",
    "firstName": "Student",
    "lastName": "16",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019020",
    "studentId": "4032019020",
    "full_name": "Student 17",
    "firstName": "Student",
    "lastName": "17",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4033333311",
    "studentId": "4033333311",
    "full_name": "Student 18",
    "firstName": "Student",
    "lastName": "18",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019022",
    "studentId": "4032019022",
    "full_name": "Student 19",
    "firstName": "Student",
    "lastName": "19",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019024",
    "studentId": "4032019024",
    "full_name": "Student 20",
    "firstName": "Student",
    "lastName": "20",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019027",
    "studentId": "4032019027",
    "full_name": "Student 21",
    "firstName": "Student",
    "lastName": "21",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019028",
    "studentId": "4032019028",
    "full_name": "Student 22",
    "firstName": "Student",
    "lastName": "22",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019029",
    "studentId": "4032019029",
    "full_name": "Student 23",
    "firstName": "Student",
    "lastName": "23",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019030",
    "studentId": "4032019030",
    "full_name": "Student 24",
    "firstName": "Student",
    "lastName": "24",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4022019034",
    "studentId": "4022019034",
    "full_name": "Student 25",
    "firstName": "Student",
    "lastName": "25",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019032",
    "studentId": "4032019032",
    "full_name": "Student 26",
    "firstName": "Student",
    "lastName": "26",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4032019033",
    "studentId": "4032019033",
    "full_name": "Student 27",
    "firstName": "Student",
    "lastName": "27",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_4002019042",
    "studentId": "4002019042",
    "full_name": "Student 28",
    "firstName": "Student",
    "lastName": "28",
    "role": "student",
    "section": "S1"
  },
  {
    "id": "stu_992019038",
    "studentId": "992019038",
    "full_name": "Student 29",
    "firstName": "Student",
    "lastName": "29",
    "role": "student",
    "section": "S1"
  }
];

export const PROFESSOR_ASSIGNMENTS: Assignment[] = [
  {
    "id": "asg_hw1",
    "type": "homework",
    "title": "HW1 Assessment",
    "shortCode": "HW1",
    "description": "Proportional assessment HW1",
    "releaseDate": "2026-09-15T08:00:00.000Z",
    "dueDate": "2026-09-22T23:59:59.000Z",
    "weightPercent": 11.11,
    "targetScale": 1.0,
    "status": "closed",
    "questions": [
      {
        "id": "asg_hw1_q1",
        "number": 1,
        "title": "1 (I)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q2",
        "number": 2,
        "title": "1 (II)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q3",
        "number": 3,
        "title": "2",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q4",
        "number": 4,
        "title": "3",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q5",
        "number": 5,
        "title": "4",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q6",
        "number": 6,
        "title": "5",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q7",
        "number": 7,
        "title": "6",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q8",
        "number": 8,
        "title": "7 (I)",
        "directMaxScore": 10.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q9",
        "number": 9,
        "title": "7 (II)",
        "directMaxScore": 10.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q10",
        "number": 10,
        "title": "7 (III)",
        "directMaxScore": 19.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q11",
        "number": 11,
        "title": "7 (IV)",
        "directMaxScore": 10.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q12",
        "number": 12,
        "title": "7 (V)",
        "directMaxScore": 10.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q13",
        "number": 13,
        "title": "7 (VI)",
        "directMaxScore": 10.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q14",
        "number": 14,
        "title": "8 (I)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q15",
        "number": 15,
        "title": "8 (II)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q16",
        "number": 16,
        "title": "9",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q17",
        "number": 17,
        "title": "10",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw1_q18",
        "number": 18,
        "title": "امتیازی (Bonus)",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": true
      }
    ],
    "totalMaxScore": 600,
    "assignedTAs": []
  },
  {
    "id": "asg_hw2",
    "type": "homework",
    "title": "HW2 Assessment",
    "shortCode": "HW2",
    "description": "Proportional assessment HW2",
    "releaseDate": "2026-09-15T08:00:00.000Z",
    "dueDate": "2026-09-22T23:59:59.000Z",
    "weightPercent": 11.11,
    "targetScale": 1.0,
    "status": "closed",
    "questions": [
      {
        "id": "asg_hw2_q1",
        "number": 1,
        "title": "1",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw2_q2",
        "number": 2,
        "title": "2  (I)",
        "directMaxScore": 20.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw2_q3",
        "number": 3,
        "title": "2 (II)",
        "directMaxScore": 20.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw2_q4",
        "number": 4,
        "title": "2 (III)",
        "directMaxScore": 20.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw2_q5",
        "number": 5,
        "title": "3 (I)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw2_q6",
        "number": 6,
        "title": "3 (II)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw2_q7",
        "number": 7,
        "title": "4 (I)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw2_q8",
        "number": 8,
        "title": "4 (II)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw2_q9",
        "number": 9,
        "title": "5",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw2_q10",
        "number": 10,
        "title": "6",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw2_q11",
        "number": 11,
        "title": "7",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw2_q12",
        "number": 12,
        "title": "8",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw2_q13",
        "number": 13,
        "title": "9",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw2_q14",
        "number": 14,
        "title": "10",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw2_q15",
        "number": 15,
        "title": "امتیازی (Bonus)",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": true
      }
    ],
    "totalMaxScore": 600,
    "assignedTAs": []
  },
  {
    "id": "asg_hw3",
    "type": "homework",
    "title": "HW3 Assessment",
    "shortCode": "HW3",
    "description": "Proportional assessment HW3",
    "releaseDate": "2026-09-15T08:00:00.000Z",
    "dueDate": "2026-09-22T23:59:59.000Z",
    "weightPercent": 11.11,
    "targetScale": 1.0,
    "status": "closed",
    "questions": [
      {
        "id": "asg_hw3_q1",
        "number": 1,
        "title": "1",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw3_q2",
        "number": 2,
        "title": "2 (I)",
        "directMaxScore": 20.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw3_q3",
        "number": 3,
        "title": "2 (II)",
        "directMaxScore": 20.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw3_q4",
        "number": 4,
        "title": "2 (III)",
        "directMaxScore": 20.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw3_q5",
        "number": 5,
        "title": "3",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw3_q6",
        "number": 6,
        "title": "4(1)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw3_q7",
        "number": 7,
        "title": "4(2)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw3_q8",
        "number": 8,
        "title": "5",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw3_q9",
        "number": 9,
        "title": "6",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw3_q10",
        "number": 10,
        "title": "7(1)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw3_q11",
        "number": 11,
        "title": "7(2)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw3_q12",
        "number": 12,
        "title": "8",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw3_q13",
        "number": 13,
        "title": "امتیازی (Bonus)",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": true
      }
    ],
    "totalMaxScore": 480,
    "assignedTAs": []
  },
  {
    "id": "asg_hw4",
    "type": "homework",
    "title": "HW4 Assessment",
    "shortCode": "HW4",
    "description": "Proportional assessment HW4",
    "releaseDate": "2026-09-15T08:00:00.000Z",
    "dueDate": "2026-09-22T23:59:59.000Z",
    "weightPercent": 11.11,
    "targetScale": 1.0,
    "status": "closed",
    "questions": [
      {
        "id": "asg_hw4_q1",
        "number": 1,
        "title": "1 (I)",
        "directMaxScore": 47.5,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw4_q2",
        "number": 2,
        "title": "1 (II)",
        "directMaxScore": 20.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw4_q3",
        "number": 3,
        "title": "1 (III)",
        "directMaxScore": 20.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw4_q4",
        "number": 4,
        "title": "2 (I)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw4_q5",
        "number": 5,
        "title": "2 (II)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw4_q6",
        "number": 6,
        "title": "3",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw4_q7",
        "number": 7,
        "title": "4",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw4_q8",
        "number": 8,
        "title": "5",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw4_q9",
        "number": 9,
        "title": "6",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw4_q10",
        "number": 10,
        "title": "7",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw4_q11",
        "number": 11,
        "title": "8",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw4_q12",
        "number": 12,
        "title": "9",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw4_q13",
        "number": 13,
        "title": "امتیازی (Bonus)",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": true
      }
    ],
    "totalMaxScore": 570,
    "assignedTAs": []
  },
  {
    "id": "asg_hw5",
    "type": "homework",
    "title": "HW5 Assessment",
    "shortCode": "HW5",
    "description": "Proportional assessment HW5",
    "releaseDate": "2026-09-15T08:00:00.000Z",
    "dueDate": "2026-09-22T23:59:59.000Z",
    "weightPercent": 11.11,
    "targetScale": 1.0,
    "status": "closed",
    "questions": [
      {
        "id": "asg_hw5_q1",
        "number": 1,
        "title": "1 (I)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw5_q2",
        "number": 2,
        "title": "1 (II)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw5_q3",
        "number": 3,
        "title": "2 (I)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw5_q4",
        "number": 4,
        "title": "2 (II)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw5_q5",
        "number": 5,
        "title": "3",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw5_q6",
        "number": 6,
        "title": "4",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw5_q7",
        "number": 7,
        "title": "5",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw5_q8",
        "number": 8,
        "title": "6",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw5_q9",
        "number": 9,
        "title": "7 (I)",
        "directMaxScore": 20.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw5_q10",
        "number": 10,
        "title": "7 (II)",
        "directMaxScore": 20.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw5_q11",
        "number": 11,
        "title": "7 (III)",
        "directMaxScore": 20.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw5_q12",
        "number": 12,
        "title": "8",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_hw5_q13",
        "number": 13,
        "title": "امتیازی (Bonus)",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": true
      }
    ],
    "totalMaxScore": 480,
    "assignedTAs": []
  },
  {
    "id": "asg_q1",
    "type": "quiz",
    "title": "Q1 Assessment",
    "shortCode": "Q1",
    "description": "Proportional assessment Q1",
    "releaseDate": "2026-09-15T08:00:00.000Z",
    "dueDate": "2026-09-22T23:59:59.000Z",
    "weightPercent": 11.11,
    "targetScale": 1.0,
    "status": "closed",
    "questions": [
      {
        "id": "asg_q1_q1",
        "number": 1,
        "title": "1",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q1_q2",
        "number": 2,
        "title": "2",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q1_q3",
        "number": 3,
        "title": "3",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q1_q4",
        "number": 4,
        "title": "4",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q1_q5",
        "number": 5,
        "title": "5 (Bonus)",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": true
      }
    ],
    "totalMaxScore": 120,
    "assignedTAs": []
  },
  {
    "id": "asg_q2",
    "type": "quiz",
    "title": "Q2 Assessment",
    "shortCode": "Q2",
    "description": "Proportional assessment Q2",
    "releaseDate": "2026-09-15T08:00:00.000Z",
    "dueDate": "2026-09-22T23:59:59.000Z",
    "weightPercent": 11.11,
    "targetScale": 1.0,
    "status": "closed",
    "questions": [
      {
        "id": "asg_q2_q1",
        "number": 1,
        "title": "1",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q2_q2",
        "number": 2,
        "title": "2 الف",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q2_q3",
        "number": 3,
        "title": "2 ب",
        "directMaxScore": 5.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q2_q4",
        "number": 4,
        "title": "3",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q2_q5",
        "number": 5,
        "title": "4",
        "directMaxScore": 30.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q2_q6",
        "number": 6,
        "title": "5 (Bonus)",
        "directMaxScore": 25.0,
        "subQuestions": [],
        "isBonus": true
      }
    ],
    "totalMaxScore": 120,
    "assignedTAs": []
  },
  {
    "id": "asg_q3",
    "type": "quiz",
    "title": "Q3 Assessment",
    "shortCode": "Q3",
    "description": "Proportional assessment Q3",
    "releaseDate": "2026-09-15T08:00:00.000Z",
    "dueDate": "2026-09-22T23:59:59.000Z",
    "weightPercent": 11.11,
    "targetScale": 1.0,
    "status": "closed",
    "questions": [
      {
        "id": "asg_q3_q1",
        "number": 1,
        "title": "1",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q3_q2",
        "number": 2,
        "title": "2",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q3_q3",
        "number": 3,
        "title": "3",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q3_q4",
        "number": 4,
        "title": "4",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q3_q5",
        "number": 5,
        "title": "5 ( امتیازی ) (Bonus)",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": true
      }
    ],
    "totalMaxScore": 240,
    "assignedTAs": []
  },
  {
    "id": "asg_q4",
    "type": "quiz",
    "title": "Q4 Assessment",
    "shortCode": "Q4",
    "description": "Proportional assessment Q4",
    "releaseDate": "2026-09-15T08:00:00.000Z",
    "dueDate": "2026-09-22T23:59:59.000Z",
    "weightPercent": 11.11,
    "targetScale": 1.0,
    "status": "closed",
    "questions": [
      {
        "id": "asg_q4_q1",
        "number": 1,
        "title": "1",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q4_q2",
        "number": 2,
        "title": "2",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q4_q3",
        "number": 3,
        "title": "3",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q4_q4",
        "number": 4,
        "title": "4",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": false
      },
      {
        "id": "asg_q4_q5",
        "number": 5,
        "title": "5 ( امتیازی ) (Bonus)",
        "directMaxScore": 60.0,
        "subQuestions": [],
        "isBonus": true
      }
    ],
    "totalMaxScore": 240,
    "assignedTAs": []
  }
];

export const PROFESSOR_GRADES: Record<string, StudentAssignmentGrade> = {
  "stu_4012019001_asg_hw1": {
    "studentId": "stu_4012019001",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 15.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 0.0,
      "asg_hw1_q6": 60.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 5.0,
      "asg_hw1_q12": 7.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 0.0,
      "asg_hw1_q16": 40.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019001_asg_hw1": {
    "studentId": "stu_4032019001",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 60.0,
      "asg_hw1_q6": 40.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 19.0,
      "asg_hw1_q11": 10.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 15.0,
      "asg_hw1_q15": 15.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 30.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019005_asg_hw1": {
    "studentId": "stu_4012019005",
    "assignmentId": "asg_hw1",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019005_asg_hw1": {
    "studentId": "stu_4032019005",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 20.0,
      "asg_hw1_q5": 0.0,
      "asg_hw1_q6": 60.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 10.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 5.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 0.0,
      "asg_hw1_q18": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019006_asg_hw1": {
    "studentId": "stu_4032019006",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 0.0,
      "asg_hw1_q6": 40.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 3.0,
      "asg_hw1_q12": 5.0,
      "asg_hw1_q13": 5.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019008_asg_hw1": {
    "studentId": "stu_4032019008",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 60.0,
      "asg_hw1_q6": 50.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 5.0,
      "asg_hw1_q11": 10.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 25.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019010_asg_hw1": {
    "studentId": "stu_4032019010",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 0.0,
      "asg_hw1_q6": 30.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 0.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019011_asg_hw1": {
    "studentId": "stu_4032019011",
    "assignmentId": "asg_hw1",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019013_asg_hw1": {
    "studentId": "stu_4032019013",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 60.0,
      "asg_hw1_q6": 0.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 0.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 0.0,
      "asg_hw1_q15": 0.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 20.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333328_asg_hw1": {
    "studentId": "stu_4033333328",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 0.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 60.0,
      "asg_hw1_q6": 60.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 0.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333044_asg_hw1": {
    "studentId": "stu_4043333044",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 60.0,
      "asg_hw1_q6": 30.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 10.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 6.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019015_asg_hw1": {
    "studentId": "stu_4032019015",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 60.0,
      "asg_hw1_q6": 60.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 10.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 0.0,
      "asg_hw1_q15": 0.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333073_asg_hw1": {
    "studentId": "stu_4043333073",
    "assignmentId": "asg_hw1",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019016_asg_hw1": {
    "studentId": "stu_4032019016",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 60.0,
      "asg_hw1_q6": 50.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 10.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 8.0,
      "asg_hw1_q14": 20.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019017_asg_hw1": {
    "studentId": "stu_4032019017",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 60.0,
      "asg_hw1_q6": 60.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 10.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019018_asg_hw1": {
    "studentId": "stu_4032019018",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 10.0,
      "asg_hw1_q6": 60.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 10.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019020_asg_hw1": {
    "studentId": "stu_4032019020",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 20.0,
      "asg_hw1_q5": 30.0,
      "asg_hw1_q6": 40.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 8.0,
      "asg_hw1_q9": 8.0,
      "asg_hw1_q10": 8.0,
      "asg_hw1_q11": 8.0,
      "asg_hw1_q12": 5.0,
      "asg_hw1_q13": 5.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333311_asg_hw1": {
    "studentId": "stu_4033333311",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 15.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 60.0,
      "asg_hw1_q6": 40.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 5.0,
      "asg_hw1_q9": 6.0,
      "asg_hw1_q10": 5.0,
      "asg_hw1_q11": 5.0,
      "asg_hw1_q12": 5.0,
      "asg_hw1_q13": 5.0,
      "asg_hw1_q14": 15.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019022_asg_hw1": {
    "studentId": "stu_4032019022",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 20.0,
      "asg_hw1_q6": 60.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 5.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019024_asg_hw1": {
    "studentId": "stu_4032019024",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 0.0,
      "asg_hw1_q6": 60.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 10.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019027_asg_hw1": {
    "studentId": "stu_4032019027",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 20.0,
      "asg_hw1_q2": 10.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 50.0,
      "asg_hw1_q6": 30.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 4.0,
      "asg_hw1_q11": 10.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 10.0,
      "asg_hw1_q15": 10.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 30.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019028_asg_hw1": {
    "studentId": "stu_4032019028",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 60.0,
      "asg_hw1_q6": 40.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 10.0,
      "asg_hw1_q12": 8.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 30.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019029_asg_hw1": {
    "studentId": "stu_4032019029",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 30.0,
      "asg_hw1_q6": 60.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 5.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 30.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019030_asg_hw1": {
    "studentId": "stu_4032019030",
    "assignmentId": "asg_hw1",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4022019034_asg_hw1": {
    "studentId": "stu_4022019034",
    "assignmentId": "asg_hw1",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019032_asg_hw1": {
    "studentId": "stu_4032019032",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 20.0,
      "asg_hw1_q6": 60.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 10.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 10.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019033_asg_hw1": {
    "studentId": "stu_4032019033",
    "assignmentId": "asg_hw1",
    "scores": {
      "asg_hw1_q1": 30.0,
      "asg_hw1_q2": 30.0,
      "asg_hw1_q3": 60.0,
      "asg_hw1_q4": 60.0,
      "asg_hw1_q5": 30.0,
      "asg_hw1_q6": 60.0,
      "asg_hw1_q7": 60.0,
      "asg_hw1_q8": 10.0,
      "asg_hw1_q9": 10.0,
      "asg_hw1_q10": 10.0,
      "asg_hw1_q11": 8.0,
      "asg_hw1_q12": 10.0,
      "asg_hw1_q13": 8.0,
      "asg_hw1_q14": 30.0,
      "asg_hw1_q15": 30.0,
      "asg_hw1_q16": 60.0,
      "asg_hw1_q17": 60.0,
      "asg_hw1_q18": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4002019042_asg_hw1": {
    "studentId": "stu_4002019042",
    "assignmentId": "asg_hw1",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019001_asg_hw2": {
    "studentId": "stu_4012019001",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 0.0,
      "asg_hw2_q2": 0.0,
      "asg_hw2_q3": 0.0,
      "asg_hw2_q4": 0.0,
      "asg_hw2_q5": 0.0,
      "asg_hw2_q6": 0.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 0.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 0.0,
      "asg_hw2_q14": 0.0,
      "asg_hw2_q15": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019001_asg_hw2": {
    "studentId": "stu_4032019001",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 30.0,
      "asg_hw2_q7": 25.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 60.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019005_asg_hw2": {
    "studentId": "stu_4012019005",
    "assignmentId": "asg_hw2",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019005_asg_hw2": {
    "studentId": "stu_4032019005",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 0.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 30.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019006_asg_hw2": {
    "studentId": "stu_4032019006",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 0.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 0.0,
      "asg_hw2_q7": 15.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 30.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019008_asg_hw2": {
    "studentId": "stu_4032019008",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 20.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 55.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 60.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 10.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019010_asg_hw2": {
    "studentId": "stu_4032019010",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 20.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 0.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 10.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 50.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019011_asg_hw2": {
    "studentId": "stu_4032019011",
    "assignmentId": "asg_hw2",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019013_asg_hw2": {
    "studentId": "stu_4032019013",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 0.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 0.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 30.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333044_asg_hw2": {
    "studentId": "stu_4043333044",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 25.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 60.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019015_asg_hw2": {
    "studentId": "stu_4032019015",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 0.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 60.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333073_asg_hw2": {
    "studentId": "stu_4043333073",
    "assignmentId": "asg_hw2",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019016_asg_hw2": {
    "studentId": "stu_4032019016",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 30.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 30.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019017_asg_hw2": {
    "studentId": "stu_4032019017",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 20.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 60.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019018_asg_hw2": {
    "studentId": "stu_4032019018",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 30.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 60.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019020_asg_hw2": {
    "studentId": "stu_4032019020",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 40.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 30.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 58.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 60.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333328_asg_hw2": {
    "studentId": "stu_4033333328",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 20.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 55.0,
      "asg_hw2_q14": 0.0,
      "asg_hw2_q15": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333311_asg_hw2": {
    "studentId": "stu_4033333311",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 30.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 10.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 45.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 60.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 10.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019022_asg_hw2": {
    "studentId": "stu_4032019022",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 35.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 30.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 60.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019024_asg_hw2": {
    "studentId": "stu_4032019024",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 30.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 60.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019027_asg_hw2": {
    "studentId": "stu_4032019027",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 40.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 20.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 55.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 60.0,
      "asg_hw2_q14": 10.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019028_asg_hw2": {
    "studentId": "stu_4032019028",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 30.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 20.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 30.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 60.0,
      "asg_hw2_q14": 0.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019029_asg_hw2": {
    "studentId": "stu_4032019029",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 0.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 0.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 55.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 30.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019030_asg_hw2": {
    "studentId": "stu_4032019030",
    "assignmentId": "asg_hw2",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4022019034_asg_hw2": {
    "studentId": "stu_4022019034",
    "assignmentId": "asg_hw2",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019032_asg_hw2": {
    "studentId": "stu_4032019032",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 20.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 60.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019033_asg_hw2": {
    "studentId": "stu_4032019033",
    "assignmentId": "asg_hw2",
    "scores": {
      "asg_hw2_q1": 60.0,
      "asg_hw2_q2": 20.0,
      "asg_hw2_q3": 20.0,
      "asg_hw2_q4": 20.0,
      "asg_hw2_q5": 30.0,
      "asg_hw2_q6": 20.0,
      "asg_hw2_q7": 30.0,
      "asg_hw2_q8": 30.0,
      "asg_hw2_q9": 60.0,
      "asg_hw2_q10": 60.0,
      "asg_hw2_q11": 60.0,
      "asg_hw2_q12": 60.0,
      "asg_hw2_q13": 60.0,
      "asg_hw2_q14": 60.0,
      "asg_hw2_q15": 30.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4002019042_asg_hw2": {
    "studentId": "stu_4002019042",
    "assignmentId": "asg_hw2",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019001_asg_hw3": {
    "studentId": "stu_4012019001",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 0.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 15.0,
      "asg_hw3_q7": 0.0,
      "asg_hw3_q8": 40.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 0.0,
      "asg_hw3_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019001_asg_hw3": {
    "studentId": "stu_4032019001",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019005_asg_hw3": {
    "studentId": "stu_4012019005",
    "assignmentId": "asg_hw3",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019005_asg_hw3": {
    "studentId": "stu_4032019005",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 59.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 58.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019006_asg_hw3": {
    "studentId": "stu_4032019006",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 0.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019008_asg_hw3": {
    "studentId": "stu_4032019008",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 50.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 0.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019010_asg_hw3": {
    "studentId": "stu_4032019010",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 0.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019011_asg_hw3": {
    "studentId": "stu_4032019011",
    "assignmentId": "asg_hw3",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019013_asg_hw3": {
    "studentId": "stu_4032019013",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 0.0,
      "asg_hw3_q8": 59.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333328_asg_hw3": {
    "studentId": "stu_4033333328",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 40.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 0.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333044_asg_hw3": {
    "studentId": "stu_4043333044",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019015_asg_hw3": {
    "studentId": "stu_4032019015",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 10.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333073_asg_hw3": {
    "studentId": "stu_4043333073",
    "assignmentId": "asg_hw3",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019016_asg_hw3": {
    "studentId": "stu_4032019016",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019017_asg_hw3": {
    "studentId": "stu_4032019017",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019018_asg_hw3": {
    "studentId": "stu_4032019018",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019020_asg_hw3": {
    "studentId": "stu_4032019020",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333311_asg_hw3": {
    "studentId": "stu_4033333311",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 0.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019022_asg_hw3": {
    "studentId": "stu_4032019022",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019024_asg_hw3": {
    "studentId": "stu_4032019024",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019027_asg_hw3": {
    "studentId": "stu_4032019027",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019028_asg_hw3": {
    "studentId": "stu_4032019028",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019029_asg_hw3": {
    "studentId": "stu_4032019029",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 0.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019030_asg_hw3": {
    "studentId": "stu_4032019030",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 58.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 0.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 50.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4022019034_asg_hw3": {
    "studentId": "stu_4022019034",
    "assignmentId": "asg_hw3",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019032_asg_hw3": {
    "studentId": "stu_4032019032",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019033_asg_hw3": {
    "studentId": "stu_4032019033",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 0.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4002019042_asg_hw3": {
    "studentId": "stu_4002019042",
    "assignmentId": "asg_hw3",
    "scores": {
      "asg_hw3_q1": 60.0,
      "asg_hw3_q2": 20.0,
      "asg_hw3_q3": 20.0,
      "asg_hw3_q4": 20.0,
      "asg_hw3_q5": 60.0,
      "asg_hw3_q6": 30.0,
      "asg_hw3_q7": 30.0,
      "asg_hw3_q8": 60.0,
      "asg_hw3_q9": 60.0,
      "asg_hw3_q10": 30.0,
      "asg_hw3_q11": 30.0,
      "asg_hw3_q12": 60.0,
      "asg_hw3_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019001_asg_hw4": {
    "studentId": "stu_4012019001",
    "assignmentId": "asg_hw4",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019001_asg_hw4": {
    "studentId": "stu_4032019001",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 0.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 50.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 35.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019005_asg_hw4": {
    "studentId": "stu_4012019005",
    "assignmentId": "asg_hw4",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019005_asg_hw4": {
    "studentId": "stu_4032019005",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 45.0,
      "asg_hw4_q9": 20.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019006_asg_hw4": {
    "studentId": "stu_4032019006",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 0.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 30.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 20.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019008_asg_hw4": {
    "studentId": "stu_4032019008",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 20.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 30.0,
      "asg_hw4_q8": 50.0,
      "asg_hw4_q9": 20.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 40.0,
      "asg_hw4_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019010_asg_hw4": {
    "studentId": "stu_4032019010",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 0.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 40.0,
      "asg_hw4_q7": 45.0,
      "asg_hw4_q8": 50.0,
      "asg_hw4_q9": 0.0,
      "asg_hw4_q10": 30.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019011_asg_hw4": {
    "studentId": "stu_4032019011",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 15.0,
      "asg_hw4_q6": 0.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 20.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 50.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019013_asg_hw4": {
    "studentId": "stu_4032019013",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 20.0,
      "asg_hw4_q9": 20.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 0.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333044_asg_hw4": {
    "studentId": "stu_4043333044",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 30.0,
      "asg_hw4_q8": 50.0,
      "asg_hw4_q9": 20.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 50.0,
      "asg_hw4_q13": 50.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019015_asg_hw4": {
    "studentId": "stu_4032019015",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 50.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 50.0,
      "asg_hw4_q10": 0.0,
      "asg_hw4_q11": 45.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333073_asg_hw4": {
    "studentId": "stu_4043333073",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 0.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 0.0,
      "asg_hw4_q8": 50.0,
      "asg_hw4_q9": 20.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019016_asg_hw4": {
    "studentId": "stu_4032019016",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 60.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 50.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019017_asg_hw4": {
    "studentId": "stu_4032019017",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 20.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 40.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 60.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019018_asg_hw4": {
    "studentId": "stu_4032019018",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 55.0,
      "asg_hw4_q9": 35.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019020_asg_hw4": {
    "studentId": "stu_4032019020",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 55.0,
      "asg_hw4_q9": 60.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333328_asg_hw4": {
    "studentId": "stu_4033333328",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 0.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 10.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 20.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 40.0,
      "asg_hw4_q12": 40.0,
      "asg_hw4_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333311_asg_hw4": {
    "studentId": "stu_4033333311",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 60.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 55.0,
      "asg_hw4_q13": 50.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019022_asg_hw4": {
    "studentId": "stu_4032019022",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 60.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 55.0,
      "asg_hw4_q12": 50.0,
      "asg_hw4_q13": 50.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019024_asg_hw4": {
    "studentId": "stu_4032019024",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 25.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 20.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019027_asg_hw4": {
    "studentId": "stu_4032019027",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 20.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019028_asg_hw4": {
    "studentId": "stu_4032019028",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 50.0,
      "asg_hw4_q9": 20.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 45.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019029_asg_hw4": {
    "studentId": "stu_4032019029",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 45.0,
      "asg_hw4_q10": 50.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019030_asg_hw4": {
    "studentId": "stu_4032019030",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 20.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 55.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 45.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4022019034_asg_hw4": {
    "studentId": "stu_4022019034",
    "assignmentId": "asg_hw4",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019032_asg_hw4": {
    "studentId": "stu_4032019032",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 45.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 60.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 50.0,
      "asg_hw4_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019033_asg_hw4": {
    "studentId": "stu_4032019033",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 40.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 20.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 60.0,
      "asg_hw4_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4002019042_asg_hw4": {
    "studentId": "stu_4002019042",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 50.0,
      "asg_hw4_q9": 60.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 50.0,
      "asg_hw4_q12": 55.0,
      "asg_hw4_q13": 20.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_992019038_asg_hw4": {
    "studentId": "stu_992019038",
    "assignmentId": "asg_hw4",
    "scores": {
      "asg_hw4_q1": 20.0,
      "asg_hw4_q2": 20.0,
      "asg_hw4_q3": 20.0,
      "asg_hw4_q4": 30.0,
      "asg_hw4_q5": 30.0,
      "asg_hw4_q6": 60.0,
      "asg_hw4_q7": 60.0,
      "asg_hw4_q8": 60.0,
      "asg_hw4_q9": 60.0,
      "asg_hw4_q10": 60.0,
      "asg_hw4_q11": 60.0,
      "asg_hw4_q12": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019001_asg_hw5": {
    "studentId": "stu_4012019001",
    "assignmentId": "asg_hw5",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019001_asg_hw5": {
    "studentId": "stu_4032019001",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019005_asg_hw5": {
    "studentId": "stu_4012019005",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019005_asg_hw5": {
    "studentId": "stu_4032019005",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019006_asg_hw5": {
    "studentId": "stu_4032019006",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 0.0,
      "asg_hw5_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019008_asg_hw5": {
    "studentId": "stu_4032019008",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019010_asg_hw5": {
    "studentId": "stu_4032019010",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 20.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 20.0,
      "asg_hw5_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019011_asg_hw5": {
    "studentId": "stu_4032019011",
    "assignmentId": "asg_hw5",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019013_asg_hw5": {
    "studentId": "stu_4032019013",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 10.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 40.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333044_asg_hw5": {
    "studentId": "stu_4043333044",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 15.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 10.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 30.0,
      "asg_hw5_q13": 30.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019015_asg_hw5": {
    "studentId": "stu_4032019015",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 20.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 0.0,
      "asg_hw5_q8": 20.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 20.0,
      "asg_hw5_q13": 50.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333073_asg_hw5": {
    "studentId": "stu_4043333073",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 20.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 40.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019016_asg_hw5": {
    "studentId": "stu_4032019016",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019017_asg_hw5": {
    "studentId": "stu_4032019017",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 45.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019018_asg_hw5": {
    "studentId": "stu_4032019018",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 25.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 0.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019020_asg_hw5": {
    "studentId": "stu_4032019020",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333328_asg_hw5": {
    "studentId": "stu_4033333328",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 20.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 10.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 0.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333311_asg_hw5": {
    "studentId": "stu_4033333311",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 45.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019022_asg_hw5": {
    "studentId": "stu_4032019022",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019024_asg_hw5": {
    "studentId": "stu_4032019024",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 0.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019027_asg_hw5": {
    "studentId": "stu_4032019027",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019028_asg_hw5": {
    "studentId": "stu_4032019028",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019029_asg_hw5": {
    "studentId": "stu_4032019029",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 10.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019030_asg_hw5": {
    "studentId": "stu_4032019030",
    "assignmentId": "asg_hw5",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4022019034_asg_hw5": {
    "studentId": "stu_4022019034",
    "assignmentId": "asg_hw5",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019032_asg_hw5": {
    "studentId": "stu_4032019032",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019033_asg_hw5": {
    "studentId": "stu_4032019033",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4002019042_asg_hw5": {
    "studentId": "stu_4002019042",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 30.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 50.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 30.0,
      "asg_hw5_q13": 30.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_992019038_asg_hw5": {
    "studentId": "stu_992019038",
    "assignmentId": "asg_hw5",
    "scores": {
      "asg_hw5_q1": 30.0,
      "asg_hw5_q2": 25.0,
      "asg_hw5_q3": 30.0,
      "asg_hw5_q4": 30.0,
      "asg_hw5_q5": 60.0,
      "asg_hw5_q6": 60.0,
      "asg_hw5_q7": 60.0,
      "asg_hw5_q8": 60.0,
      "asg_hw5_q9": 20.0,
      "asg_hw5_q10": 20.0,
      "asg_hw5_q11": 20.0,
      "asg_hw5_q12": 60.0,
      "asg_hw5_q13": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019001_asg_q1": {
    "studentId": "stu_4012019001",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 0.0,
      "asg_q1_q2": 15.0,
      "asg_q1_q3": 15.0,
      "asg_q1_q4": 30.0,
      "asg_q1_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019001_asg_q1": {
    "studentId": "stu_4032019001",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 5.0,
      "asg_q1_q2": 15.0,
      "asg_q1_q3": 10.0,
      "asg_q1_q4": 30.0,
      "asg_q1_q5": 10.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019005_asg_q1": {
    "studentId": "stu_4012019005",
    "assignmentId": "asg_q1",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019005_asg_q1": {
    "studentId": "stu_4032019005",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 30.0,
      "asg_q1_q2": 30.0,
      "asg_q1_q3": 15.0,
      "asg_q1_q4": 20.0,
      "asg_q1_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019006_asg_q1": {
    "studentId": "stu_4032019006",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 0.0,
      "asg_q1_q2": 10.0,
      "asg_q1_q3": 0.0,
      "asg_q1_q4": 30.0,
      "asg_q1_q5": 15.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019008_asg_q1": {
    "studentId": "stu_4032019008",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 5.0,
      "asg_q1_q2": 20.0,
      "asg_q1_q3": 0.0,
      "asg_q1_q4": 0.0,
      "asg_q1_q5": 15.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019010_asg_q1": {
    "studentId": "stu_4032019010",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 10.0,
      "asg_q1_q2": 30.0,
      "asg_q1_q3": 15.0,
      "asg_q1_q4": 15.0,
      "asg_q1_q5": 20.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019011_asg_q1": {
    "studentId": "stu_4032019011",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 0.0,
      "asg_q1_q2": 20.0,
      "asg_q1_q3": 0.0,
      "asg_q1_q4": 10.0,
      "asg_q1_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019013_asg_q1": {
    "studentId": "stu_4032019013",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 0.0,
      "asg_q1_q2": 30.0,
      "asg_q1_q3": 25.0,
      "asg_q1_q4": 0.0,
      "asg_q1_q5": 30.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333328_asg_q1": {
    "studentId": "stu_4033333328",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 5.0,
      "asg_q1_q2": 15.0,
      "asg_q1_q3": 0.0,
      "asg_q1_q4": 0.0,
      "asg_q1_q5": 15.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333044_asg_q1": {
    "studentId": "stu_4043333044",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 0.0,
      "asg_q1_q2": 20.0,
      "asg_q1_q3": 15.0,
      "asg_q1_q4": 15.0,
      "asg_q1_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019015_asg_q1": {
    "studentId": "stu_4032019015",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 20.0,
      "asg_q1_q2": 10.0,
      "asg_q1_q3": 0.0,
      "asg_q1_q4": 0.0,
      "asg_q1_q5": 15.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333073_asg_q1": {
    "studentId": "stu_4043333073",
    "assignmentId": "asg_q1",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019016_asg_q1": {
    "studentId": "stu_4032019016",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 30.0,
      "asg_q1_q2": 30.0,
      "asg_q1_q3": 30.0,
      "asg_q1_q4": 30.0,
      "asg_q1_q5": 15.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019017_asg_q1": {
    "studentId": "stu_4032019017",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 10.0,
      "asg_q1_q2": 15.0,
      "asg_q1_q3": 10.0,
      "asg_q1_q4": 0.0,
      "asg_q1_q5": 20.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019018_asg_q1": {
    "studentId": "stu_4032019018",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 25.0,
      "asg_q1_q2": 30.0,
      "asg_q1_q3": 20.0,
      "asg_q1_q4": 0.0,
      "asg_q1_q5": 15.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019020_asg_q1": {
    "studentId": "stu_4032019020",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 25.0,
      "asg_q1_q2": 30.0,
      "asg_q1_q3": 30.0,
      "asg_q1_q4": 30.0,
      "asg_q1_q5": 30.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333311_asg_q1": {
    "studentId": "stu_4033333311",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 5.0,
      "asg_q1_q2": 15.0,
      "asg_q1_q3": 10.0,
      "asg_q1_q4": 0.0,
      "asg_q1_q5": 15.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019022_asg_q1": {
    "studentId": "stu_4032019022",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 30.0,
      "asg_q1_q2": 15.0,
      "asg_q1_q3": 15.0,
      "asg_q1_q4": 20.0,
      "asg_q1_q5": 25.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019024_asg_q1": {
    "studentId": "stu_4032019024",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 5.0,
      "asg_q1_q2": 25.0,
      "asg_q1_q3": 5.0,
      "asg_q1_q4": 30.0,
      "asg_q1_q5": 30.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019027_asg_q1": {
    "studentId": "stu_4032019027",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 5.0,
      "asg_q1_q2": 15.0,
      "asg_q1_q3": 20.0,
      "asg_q1_q4": 30.0,
      "asg_q1_q5": 20.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019028_asg_q1": {
    "studentId": "stu_4032019028",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 10.0,
      "asg_q1_q2": 30.0,
      "asg_q1_q3": 30.0,
      "asg_q1_q4": 5.0,
      "asg_q1_q5": 10.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019029_asg_q1": {
    "studentId": "stu_4032019029",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 5.0,
      "asg_q1_q2": 15.0,
      "asg_q1_q3": 15.0,
      "asg_q1_q4": 15.0,
      "asg_q1_q5": 10.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019030_asg_q1": {
    "studentId": "stu_4032019030",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 5.0,
      "asg_q1_q2": 15.0,
      "asg_q1_q3": 15.0,
      "asg_q1_q4": 30.0,
      "asg_q1_q5": 20.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4022019034_asg_q1": {
    "studentId": "stu_4022019034",
    "assignmentId": "asg_q1",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019032_asg_q1": {
    "studentId": "stu_4032019032",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 30.0,
      "asg_q1_q2": 25.0,
      "asg_q1_q3": 5.0,
      "asg_q1_q4": 30.0,
      "asg_q1_q5": 30.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019033_asg_q1": {
    "studentId": "stu_4032019033",
    "assignmentId": "asg_q1",
    "scores": {
      "asg_q1_q1": 5.0,
      "asg_q1_q2": 20.0,
      "asg_q1_q3": 20.0,
      "asg_q1_q4": 0.0,
      "asg_q1_q5": 15.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4002019042_asg_q1": {
    "studentId": "stu_4002019042",
    "assignmentId": "asg_q1",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_992019038_asg_q1": {
    "studentId": "stu_992019038",
    "assignmentId": "asg_q1",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019001_asg_q2": {
    "studentId": "stu_4012019001",
    "assignmentId": "asg_q2",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019001_asg_q2": {
    "studentId": "stu_4032019001",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 0.0,
      "asg_q2_q2": 25.0,
      "asg_q2_q3": 5.0,
      "asg_q2_q4": 3.0,
      "asg_q2_q5": 30.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019005_asg_q2": {
    "studentId": "stu_4012019005",
    "assignmentId": "asg_q2",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019005_asg_q2": {
    "studentId": "stu_4032019005",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 30.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 5.0,
      "asg_q2_q4": 30.0,
      "asg_q2_q5": 30.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019006_asg_q2": {
    "studentId": "stu_4032019006",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 30.0,
      "asg_q2_q2": 15.0,
      "asg_q2_q3": 0.0,
      "asg_q2_q4": 20.0,
      "asg_q2_q5": 20.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019008_asg_q2": {
    "studentId": "stu_4032019008",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 5.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 0.0,
      "asg_q2_q4": 28.0,
      "asg_q2_q5": 30.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019010_asg_q2": {
    "studentId": "stu_4032019010",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 30.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 1.0,
      "asg_q2_q4": 20.0,
      "asg_q2_q5": 30.0,
      "asg_q2_q6": 3.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019011_asg_q2": {
    "studentId": "stu_4032019011",
    "assignmentId": "asg_q2",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019013_asg_q2": {
    "studentId": "stu_4032019013",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 3.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 0.0,
      "asg_q2_q4": 8.0,
      "asg_q2_q5": 30.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333328_asg_q2": {
    "studentId": "stu_4033333328",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 0.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 0.0,
      "asg_q2_q4": 0.0,
      "asg_q2_q5": 20.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333044_asg_q2": {
    "studentId": "stu_4043333044",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 0.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 5.0,
      "asg_q2_q4": 0.0,
      "asg_q2_q5": 5.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019015_asg_q2": {
    "studentId": "stu_4032019015",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 26.0,
      "asg_q2_q2": 20.0,
      "asg_q2_q3": 5.0,
      "asg_q2_q4": 0.0,
      "asg_q2_q5": 10.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333073_asg_q2": {
    "studentId": "stu_4043333073",
    "assignmentId": "asg_q2",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019016_asg_q2": {
    "studentId": "stu_4032019016",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 30.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 0.0,
      "asg_q2_q4": 20.0,
      "asg_q2_q5": 30.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019017_asg_q2": {
    "studentId": "stu_4032019017",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 3.0,
      "asg_q2_q2": 0.0,
      "asg_q2_q3": 0.0,
      "asg_q2_q4": 5.0,
      "asg_q2_q5": 27.0,
      "asg_q2_q6": 5.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019018_asg_q2": {
    "studentId": "stu_4032019018",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 30.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 5.0,
      "asg_q2_q4": 30.0,
      "asg_q2_q5": 30.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019020_asg_q2": {
    "studentId": "stu_4032019020",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 5.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 5.0,
      "asg_q2_q4": 30.0,
      "asg_q2_q5": 30.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333311_asg_q2": {
    "studentId": "stu_4033333311",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 0.0,
      "asg_q2_q2": 10.0,
      "asg_q2_q3": 0.0,
      "asg_q2_q4": 5.0,
      "asg_q2_q5": 8.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019022_asg_q2": {
    "studentId": "stu_4032019022",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 30.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 0.0,
      "asg_q2_q4": 30.0,
      "asg_q2_q5": 30.0,
      "asg_q2_q6": 25.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019024_asg_q2": {
    "studentId": "stu_4032019024",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 0.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 0.0,
      "asg_q2_q4": 30.0,
      "asg_q2_q5": 30.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019027_asg_q2": {
    "studentId": "stu_4032019027",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 28.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 0.0,
      "asg_q2_q4": 30.0,
      "asg_q2_q5": 15.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019028_asg_q2": {
    "studentId": "stu_4032019028",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 5.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 0.0,
      "asg_q2_q4": 30.0,
      "asg_q2_q5": 30.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019029_asg_q2": {
    "studentId": "stu_4032019029",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 25.0,
      "asg_q2_q2": 25.0,
      "asg_q2_q3": 0.0,
      "asg_q2_q4": 15.0,
      "asg_q2_q5": 30.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019030_asg_q2": {
    "studentId": "stu_4032019030",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 3.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 1.0,
      "asg_q2_q4": 0.0,
      "asg_q2_q5": 30.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4022019034_asg_q2": {
    "studentId": "stu_4022019034",
    "assignmentId": "asg_q2",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019032_asg_q2": {
    "studentId": "stu_4032019032",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 15.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 0.0,
      "asg_q2_q4": 30.0,
      "asg_q2_q5": 28.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019033_asg_q2": {
    "studentId": "stu_4032019033",
    "assignmentId": "asg_q2",
    "scores": {
      "asg_q2_q1": 30.0,
      "asg_q2_q2": 30.0,
      "asg_q2_q3": 1.0,
      "asg_q2_q4": 8.0,
      "asg_q2_q5": 29.0,
      "asg_q2_q6": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4002019042_asg_q2": {
    "studentId": "stu_4002019042",
    "assignmentId": "asg_q2",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_992019038_asg_q2": {
    "studentId": "stu_992019038",
    "assignmentId": "asg_q2",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019001_asg_q3": {
    "studentId": "stu_4012019001",
    "assignmentId": "asg_q3",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019001_asg_q3": {
    "studentId": "stu_4032019001",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 60.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 60.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019005_asg_q3": {
    "studentId": "stu_4012019005",
    "assignmentId": "asg_q3",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019005_asg_q3": {
    "studentId": "stu_4032019005",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 60.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 30.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 45.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019006_asg_q3": {
    "studentId": "stu_4032019006",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 40.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 30.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019008_asg_q3": {
    "studentId": "stu_4032019008",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 60.0,
      "asg_q3_q2": 30.0,
      "asg_q3_q3": 60.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019010_asg_q3": {
    "studentId": "stu_4032019010",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 20.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 53.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 45.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019011_asg_q3": {
    "studentId": "stu_4032019011",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 30.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 60.0,
      "asg_q3_q4": 0.0,
      "asg_q3_q5": 58.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019013_asg_q3": {
    "studentId": "stu_4032019013",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 40.0,
      "asg_q3_q2": 20.0,
      "asg_q3_q3": 60.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333328_asg_q3": {
    "studentId": "stu_4033333328",
    "assignmentId": "asg_q3",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333044_asg_q3": {
    "studentId": "stu_4043333044",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 40.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 0.0,
      "asg_q3_q4": 40.0,
      "asg_q3_q5": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019015_asg_q3": {
    "studentId": "stu_4032019015",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 60.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 0.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333073_asg_q3": {
    "studentId": "stu_4043333073",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 25.0,
      "asg_q3_q2": 35.0,
      "asg_q3_q3": 0.0,
      "asg_q3_q4": 0.0,
      "asg_q3_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019016_asg_q3": {
    "studentId": "stu_4032019016",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 60.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 60.0,
      "asg_q3_q4": 45.0,
      "asg_q3_q5": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019017_asg_q3": {
    "studentId": "stu_4032019017",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 60.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 60.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019018_asg_q3": {
    "studentId": "stu_4032019018",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 50.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 5.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019020_asg_q3": {
    "studentId": "stu_4032019020",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 60.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 60.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 45.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333311_asg_q3": {
    "studentId": "stu_4033333311",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 60.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 60.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019022_asg_q3": {
    "studentId": "stu_4032019022",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 35.0,
      "asg_q3_q2": 35.0,
      "asg_q3_q3": 25.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 40.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019024_asg_q3": {
    "studentId": "stu_4032019024",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 25.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 23.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019027_asg_q3": {
    "studentId": "stu_4032019027",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 60.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 60.0,
      "asg_q3_q4": 0.0,
      "asg_q3_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019028_asg_q3": {
    "studentId": "stu_4032019028",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 20.0,
      "asg_q3_q2": 20.0,
      "asg_q3_q3": 30.0,
      "asg_q3_q4": 15.0,
      "asg_q3_q5": 40.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019029_asg_q3": {
    "studentId": "stu_4032019029",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 45.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 60.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019030_asg_q3": {
    "studentId": "stu_4032019030",
    "assignmentId": "asg_q3",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4022019034_asg_q3": {
    "studentId": "stu_4022019034",
    "assignmentId": "asg_q3",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019032_asg_q3": {
    "studentId": "stu_4032019032",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 60.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 60.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 40.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019033_asg_q3": {
    "studentId": "stu_4032019033",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 60.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 0.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4002019042_asg_q3": {
    "studentId": "stu_4002019042",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 20.0,
      "asg_q3_q2": 10.0,
      "asg_q3_q3": 15.0,
      "asg_q3_q4": 0.0,
      "asg_q3_q5": 5.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_992019038_asg_q3": {
    "studentId": "stu_992019038",
    "assignmentId": "asg_q3",
    "scores": {
      "asg_q3_q1": 60.0,
      "asg_q3_q2": 60.0,
      "asg_q3_q3": 60.0,
      "asg_q3_q4": 60.0,
      "asg_q3_q5": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019001_asg_q4": {
    "studentId": "stu_4012019001",
    "assignmentId": "asg_q4",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019001_asg_q4": {
    "studentId": "stu_4032019001",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 40.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 60.0,
      "asg_q4_q4": 50.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4012019005_asg_q4": {
    "studentId": "stu_4012019005",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 30.0,
      "asg_q4_q3": 0.0,
      "asg_q4_q4": 0.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019005_asg_q4": {
    "studentId": "stu_4032019005",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 60.0,
      "asg_q4_q4": 60.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019006_asg_q4": {
    "studentId": "stu_4032019006",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 60.0,
      "asg_q4_q4": 50.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019008_asg_q4": {
    "studentId": "stu_4032019008",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 60.0,
      "asg_q4_q4": 60.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019010_asg_q4": {
    "studentId": "stu_4032019010",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 30.0,
      "asg_q4_q3": 50.0,
      "asg_q4_q4": 30.0,
      "asg_q4_q5": 5.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019011_asg_q4": {
    "studentId": "stu_4032019011",
    "assignmentId": "asg_q4",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019013_asg_q4": {
    "studentId": "stu_4032019013",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 60.0,
      "asg_q4_q4": 0.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333328_asg_q4": {
    "studentId": "stu_4033333328",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 0.0,
      "asg_q4_q3": 40.0,
      "asg_q4_q4": 50.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333044_asg_q4": {
    "studentId": "stu_4043333044",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 0.0,
      "asg_q4_q3": 60.0,
      "asg_q4_q4": 50.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019015_asg_q4": {
    "studentId": "stu_4032019015",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 0.0,
      "asg_q4_q3": 60.0,
      "asg_q4_q4": 60.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4043333073_asg_q4": {
    "studentId": "stu_4043333073",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 0.0,
      "asg_q4_q4": 60.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019016_asg_q4": {
    "studentId": "stu_4032019016",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 55.0,
      "asg_q4_q3": 60.0,
      "asg_q4_q4": 60.0,
      "asg_q4_q5": 55.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019017_asg_q4": {
    "studentId": "stu_4032019017",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 30.0,
      "asg_q4_q3": 60.0,
      "asg_q4_q4": 50.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019018_asg_q4": {
    "studentId": "stu_4032019018",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 50.0,
      "asg_q4_q3": 55.0,
      "asg_q4_q4": 60.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019020_asg_q4": {
    "studentId": "stu_4032019020",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 55.0,
      "asg_q4_q4": 60.0,
      "asg_q4_q5": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4033333311_asg_q4": {
    "studentId": "stu_4033333311",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 55.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 40.0,
      "asg_q4_q4": 50.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019022_asg_q4": {
    "studentId": "stu_4032019022",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 60.0,
      "asg_q4_q4": 60.0,
      "asg_q4_q5": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019024_asg_q4": {
    "studentId": "stu_4032019024",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 60.0,
      "asg_q4_q4": 60.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019027_asg_q4": {
    "studentId": "stu_4032019027",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 60.0,
      "asg_q4_q4": 60.0,
      "asg_q4_q5": 60.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019028_asg_q4": {
    "studentId": "stu_4032019028",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 50.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 30.0,
      "asg_q4_q4": 0.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019029_asg_q4": {
    "studentId": "stu_4032019029",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 60.0,
      "asg_q4_q4": 60.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019030_asg_q4": {
    "studentId": "stu_4032019030",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 5.0,
      "asg_q4_q4": 60.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4022019034_asg_q4": {
    "studentId": "stu_4022019034",
    "assignmentId": "asg_q4",
    "scores": {},
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019032_asg_q4": {
    "studentId": "stu_4032019032",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 60.0,
      "asg_q4_q4": 60.0,
      "asg_q4_q5": 45.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4032019033_asg_q4": {
    "studentId": "stu_4032019033",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 50.0,
      "asg_q4_q4": 50.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_4002019042_asg_q4": {
    "studentId": "stu_4002019042",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 0.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 30.0,
      "asg_q4_q4": 50.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  },
  "stu_992019038_asg_q4": {
    "studentId": "stu_992019038",
    "assignmentId": "asg_q4",
    "scores": {
      "asg_q4_q1": 60.0,
      "asg_q4_q2": 60.0,
      "asg_q4_q3": 0.0,
      "asg_q4_q4": 5.0,
      "asg_q4_q5": 0.0
    },
    "gradedBy": "TA Staff",
    "gradedAt": "2026-10-01T12:00:00.000Z"
  }
};

export const PROFESSOR_FINAL_SHEET_TRUTH = [
  {
    "studentId": "stu_4012019001",
    "studentNumber": "4012019001",
    "studentName": "Student 01",
    "assignmentScores": {
      "asg_hw1": 0.77,
      "asg_hw2": 0.4,
      "asg_hw3": 0.61,
      "asg_hw4": 0.0,
      "asg_hw5": 0.0,
      "asg_q1": 0.5,
      "asg_q2": 0.0,
      "asg_q3": 0.0,
      "asg_q4": 0.0
    },
    "excelFinalScore": 1.27
  },
  {
    "studentId": "stu_4032019001",
    "studentNumber": "4032019001",
    "studentName": "Student 02",
    "assignmentScores": {
      "asg_hw1": 0.97,
      "asg_hw2": 1.09,
      "asg_hw3": 1.13,
      "asg_hw4": 0.96,
      "asg_hw5": 1.13,
      "asg_q1": 0.58,
      "asg_q2": 0.53,
      "asg_q3": 1.25,
      "asg_q4": 0.88
    },
    "excelFinalScore": 4.73
  },
  {
    "studentId": "stu_4012019005",
    "studentNumber": "4012019005",
    "studentName": "Student 03",
    "assignmentScores": {
      "asg_hw1": 0.8,
      "asg_hw2": 0.8,
      "asg_hw3": 0.0,
      "asg_hw4": 0.0,
      "asg_hw5": 0.45,
      "asg_q1": 0.0,
      "asg_q2": 0.0,
      "asg_q3": 0.0,
      "asg_q4": 0.38
    },
    "excelFinalScore": 1.35
  },
  {
    "studentId": "stu_4032019005",
    "studentNumber": "4032019005",
    "studentName": "Student 04",
    "assignmentScores": {
      "asg_hw1": 0.81,
      "asg_hw2": 1.0,
      "asg_hw3": 1.12,
      "asg_hw4": 0.85,
      "asg_hw5": 1.13,
      "asg_q1": 0.79,
      "asg_q2": 1.04,
      "asg_q3": 1.06,
      "asg_q4": 1.0
    },
    "excelFinalScore": 4.89
  },
  {
    "studentId": "stu_4032019006",
    "studentNumber": "4032019006",
    "studentName": "Student 05",
    "assignmentScores": {
      "asg_hw1": 0.92,
      "asg_hw2": 0.94,
      "asg_hw3": 0.94,
      "asg_hw4": 0.79,
      "asg_hw5": 1.0,
      "asg_q1": 0.46,
      "asg_q2": 0.71,
      "asg_q3": 0.79,
      "asg_q4": 0.96
    },
    "excelFinalScore": 4.17
  },
  {
    "studentId": "stu_4032019008",
    "studentNumber": "4032019008",
    "studentName": "Student 06",
    "assignmentScores": {
      "asg_hw1": 0.95,
      "asg_hw2": 0.99,
      "asg_hw3": 1.04,
      "asg_hw4": 0.75,
      "asg_hw5": 1.0,
      "asg_q1": 0.33,
      "asg_q2": 0.78,
      "asg_q3": 0.88,
      "asg_q4": 1.0
    },
    "excelFinalScore": 4.29
  },
  {
    "studentId": "stu_4032019010",
    "studentNumber": "4032019010",
    "studentName": "Student 07",
    "assignmentScores": {
      "asg_hw1": 0.92,
      "asg_hw2": 0.93,
      "asg_hw3": 1.06,
      "asg_hw4": 0.68,
      "asg_hw5": 0.9,
      "asg_q1": 0.75,
      "asg_q2": 0.95,
      "asg_q3": 0.99,
      "asg_q4": 0.73
    },
    "excelFinalScore": 4.39
  },
  {
    "studentId": "stu_4032019011",
    "studentNumber": "4032019011",
    "studentName": "Student 08",
    "assignmentScores": {
      "asg_hw1": 0.0,
      "asg_hw2": 0.0,
      "asg_hw3": 0.0,
      "asg_hw4": 0.83,
      "asg_hw5": 0.0,
      "asg_q1": 0.25,
      "asg_q2": 0.0,
      "asg_q3": 0.87,
      "asg_q4": 0.0
    },
    "excelFinalScore": 1.08
  },
  {
    "studentId": "stu_4032019013",
    "studentNumber": "4032019013",
    "studentName": "Student 09",
    "assignmentScores": {
      "asg_hw1": 0.8,
      "asg_hw2": 0.97,
      "asg_hw3": 1.06,
      "asg_hw4": 0.7,
      "asg_hw5": 1.06,
      "asg_q1": 0.71,
      "asg_q2": 0.59,
      "asg_q3": 0.75,
      "asg_q4": 0.75
    },
    "excelFinalScore": 4.11
  },
  {
    "studentId": "stu_4033333328",
    "studentNumber": "4033333328",
    "studentName": "Student 10",
    "assignmentScores": {
      "asg_hw1": 1.02,
      "asg_hw2": 0.88,
      "asg_hw3": 1.02,
      "asg_hw4": 0.68,
      "asg_hw5": 0.94,
      "asg_q1": 0.29,
      "asg_q2": 0.42,
      "asg_q3": 0.0,
      "asg_q4": 0.63
    },
    "excelFinalScore": 3.27
  },
  {
    "studentId": "stu_4043333044",
    "studentNumber": "4043333044",
    "studentName": "Student 11",
    "assignmentScores": {
      "asg_hw1": 1.03,
      "asg_hw2": 1.09,
      "asg_hw3": 1.13,
      "asg_hw4": 0.88,
      "asg_hw5": 0.95,
      "asg_q1": 0.42,
      "asg_q2": 0.33,
      "asg_q3": 0.83,
      "asg_q4": 0.71
    },
    "excelFinalScore": 4.09
  },
  {
    "studentId": "stu_4032019015",
    "studentNumber": "4032019015",
    "studentName": "Student 12",
    "assignmentScores": {
      "asg_hw1": 0.98,
      "asg_hw2": 1.05,
      "asg_hw3": 1.1,
      "asg_hw4": 0.89,
      "asg_hw5": 0.79,
      "asg_q1": 0.38,
      "asg_q2": 0.51,
      "asg_q3": 0.75,
      "asg_q4": 0.75
    },
    "excelFinalScore": 4.0
  },
  {
    "studentId": "stu_4043333073",
    "studentNumber": "4043333073",
    "studentName": "Student 13",
    "assignmentScores": {
      "asg_hw1": 0.8,
      "asg_hw2": 0.8,
      "asg_hw3": 0.0,
      "asg_hw4": 0.7,
      "asg_hw5": 0.66,
      "asg_q1": 0.0,
      "asg_q2": 0.0,
      "asg_q3": 0.25,
      "asg_q4": 0.75
    },
    "excelFinalScore": 2.2
  },
  {
    "studentId": "stu_4032019016",
    "studentNumber": "4032019016",
    "studentName": "Student 14",
    "assignmentScores": {
      "asg_hw1": 1.05,
      "asg_hw2": 1.05,
      "asg_hw3": 1.13,
      "asg_hw4": 1.04,
      "asg_hw5": 1.13,
      "asg_q1": 1.0,
      "asg_q2": 0.92,
      "asg_q3": 1.19,
      "asg_q4": 1.21
    },
    "excelFinalScore": 5.4
  },
  {
    "studentId": "stu_4032019017",
    "studentNumber": "4032019017",
    "studentName": "Student 15",
    "assignmentScores": {
      "asg_hw1": 1.08,
      "asg_hw2": 1.08,
      "asg_hw3": 1.13,
      "asg_hw4": 1.0,
      "asg_hw5": 1.09,
      "asg_q1": 0.42,
      "asg_q2": 0.33,
      "asg_q3": 1.25,
      "asg_q4": 0.83
    },
    "excelFinalScore": 4.56
  },
  {
    "studentId": "stu_4032019018",
    "studentNumber": "4032019018",
    "studentName": "Student 16",
    "assignmentScores": {
      "asg_hw1": 1.0,
      "asg_hw2": 1.1,
      "asg_hw3": 1.13,
      "asg_hw4": 1.0,
      "asg_hw5": 1.07,
      "asg_q1": 0.75,
      "asg_q2": 1.04,
      "asg_q3": 0.73,
      "asg_q4": 0.94
    },
    "excelFinalScore": 4.87
  },
  {
    "studentId": "stu_4032019020",
    "studentNumber": "4032019020",
    "studentName": "Student 17",
    "assignmentScores": {
      "asg_hw1": 0.9,
      "asg_hw2": 1.06,
      "asg_hw3": 1.13,
      "asg_hw4": 1.04,
      "asg_hw5": 1.13,
      "asg_q1": 1.21,
      "asg_q2": 0.83,
      "asg_q3": 1.19,
      "asg_q4": 1.23
    },
    "excelFinalScore": 5.4
  },
  {
    "studentId": "stu_4033333311",
    "studentNumber": "4033333311",
    "studentName": "Student 18",
    "assignmentScores": {
      "asg_hw1": 0.85,
      "asg_hw2": 0.96,
      "asg_hw3": 1.06,
      "asg_hw4": 1.09,
      "asg_hw5": 1.09,
      "asg_q1": 0.38,
      "asg_q2": 0.19,
      "asg_q3": 1.0,
      "asg_q4": 0.85
    },
    "excelFinalScore": 4.15
  },
  {
    "studentId": "stu_4032019022",
    "studentNumber": "4032019022",
    "studentName": "Student 19",
    "assignmentScores": {
      "asg_hw1": 1.01,
      "asg_hw2": 1.06,
      "asg_hw3": 1.13,
      "asg_hw4": 1.01,
      "asg_hw5": 1.13,
      "asg_q1": 0.88,
      "asg_q2": 1.21,
      "asg_q3": 0.81,
      "asg_q4": 1.25
    },
    "excelFinalScore": 5.27
  },
  {
    "studentId": "stu_4032019024",
    "studentNumber": "4032019024",
    "studentName": "Student 20",
    "assignmentScores": {
      "asg_hw1": 0.89,
      "asg_hw2": 1.1,
      "asg_hw3": 1.13,
      "asg_hw4": 0.87,
      "asg_hw5": 0.88,
      "asg_q1": 0.75,
      "asg_q2": 0.75,
      "asg_q3": 0.95,
      "asg_q4": 1.0
    },
    "excelFinalScore": 4.62
  },
  {
    "studentId": "stu_4032019027",
    "studentNumber": "4032019027",
    "studentName": "Student 21",
    "assignmentScores": {
      "asg_hw1": 0.84,
      "asg_hw2": 0.96,
      "asg_hw3": 1.13,
      "asg_hw4": 0.98,
      "asg_hw5": 1.13,
      "asg_q1": 0.75,
      "asg_q2": 0.86,
      "asg_q3": 0.75,
      "asg_q4": 1.25
    },
    "excelFinalScore": 4.81
  },
  {
    "studentId": "stu_4032019028",
    "studentNumber": "4032019028",
    "studentName": "Student 22",
    "assignmentScores": {
      "asg_hw1": 1.0,
      "asg_hw2": 0.88,
      "asg_hw3": 1.13,
      "asg_hw4": 0.83,
      "asg_hw5": 1.0,
      "asg_q1": 0.71,
      "asg_q2": 0.79,
      "asg_q3": 0.52,
      "asg_q4": 0.58
    },
    "excelFinalScore": 4.13
  },
  {
    "studentId": "stu_4032019029",
    "studentNumber": "4032019029",
    "studentName": "Student 23",
    "assignmentScores": {
      "asg_hw1": 0.98,
      "asg_hw2": 0.96,
      "asg_hw3": 1.0,
      "asg_hw4": 0.9,
      "asg_hw5": 0.98,
      "asg_q1": 0.46,
      "asg_q2": 0.79,
      "asg_q3": 0.94,
      "asg_q4": 1.0
    },
    "excelFinalScore": 4.45
  },
  {
    "studentId": "stu_4032019030",
    "studentNumber": "4032019030",
    "studentName": "Student 24",
    "assignmentScores": {
      "asg_hw1": 0.0,
      "asg_hw2": 0.0,
      "asg_hw3": 0.98,
      "asg_hw4": 0.95,
      "asg_hw5": 0.0,
      "asg_q1": 0.71,
      "asg_q2": 0.53,
      "asg_q3": 0.0,
      "asg_q4": 0.77
    },
    "excelFinalScore": 2.19
  },
  {
    "studentId": "stu_4022019034",
    "studentNumber": "4022019034",
    "studentName": "Student 25",
    "assignmentScores": {
      "asg_hw1": 0.0,
      "asg_hw2": 0.0,
      "asg_hw3": 0.0,
      "asg_hw4": 0.0,
      "asg_hw5": 0.0,
      "asg_q1": 0.0,
      "asg_q2": 0.0,
      "asg_q3": 0.0,
      "asg_q4": 0.0
    },
    "excelFinalScore": 0.0
  },
  {
    "studentId": "stu_4032019032",
    "studentNumber": "4032019032",
    "studentName": "Student 26",
    "assignmentScores": {
      "asg_hw1": 1.02,
      "asg_hw2": 1.08,
      "asg_hw3": 1.13,
      "asg_hw4": 1.01,
      "asg_hw5": 1.13,
      "asg_q1": 1.0,
      "asg_q2": 0.86,
      "asg_q3": 1.17,
      "asg_q4": 1.19
    },
    "excelFinalScore": 5.33
  },
  {
    "studentId": "stu_4032019033",
    "studentNumber": "4032019033",
    "studentName": "Student 27",
    "assignmentScores": {
      "asg_hw1": 0.93,
      "asg_hw2": 1.03,
      "asg_hw3": 1.06,
      "asg_hw4": 0.84,
      "asg_hw5": 1.13,
      "asg_q1": 0.5,
      "asg_q2": 0.82,
      "asg_q3": 0.75,
      "asg_q4": 0.92
    },
    "excelFinalScore": 4.43
  },
  {
    "studentId": "stu_4002019042",
    "studentNumber": "4002019042",
    "studentName": "Student 28",
    "assignmentScores": {
      "asg_hw1": 0.5,
      "asg_hw2": 0.4,
      "asg_hw3": 1.0,
      "asg_hw4": 0.94,
      "asg_hw5": 0.98,
      "asg_q1": 0.0,
      "asg_q2": 0.0,
      "asg_q3": 0.21,
      "asg_q4": 0.58
    },
    "excelFinalScore": 2.56
  },
  {
    "studentId": "stu_992019038",
    "studentNumber": "992019038",
    "studentName": "Student 29",
    "assignmentScores": {
      "asg_hw1": 0.0,
      "asg_hw2": 0.0,
      "asg_hw3": 0.0,
      "asg_hw4": 1.0,
      "asg_hw5": 1.11,
      "asg_q1": 0.0,
      "asg_q2": 0.0,
      "asg_q3": 1.25,
      "asg_q4": 0.52
    },
    "excelFinalScore": 2.16
  }
];
