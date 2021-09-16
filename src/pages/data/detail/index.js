import React, { useEffect, useState } from 'react';
import styles from './index.less';
import d1 from 'images/data/d1.png';
import share from 'images/data/share.png';
import download from 'images/data/download.png';
import m1 from 'images/data/m1.png';
import m2 from 'images/data/m2.png';

const tabs = [
  { label: 'Description', value: 0 },
  { label: 'Date', value: 1 },
  { label: 'Leaderboard', value: 2 },
  { label: 'Rules', value: 3 },
];
const dataTable = [
  { doc: 'book_test.parquet', size: '55 M' },
  { doc: 'book_test1.parquet', size: '55 M' },
  { doc: 'book_test2.parquet', size: '1.6 G' },
];
const leaderData = [
  {
    rank: 1,
    name: 'WANGYING123',
    vote: 6193,
    score: '1.00000',
    entries: 1,
  },
  {
    rank: 2,
    name: 'B0721217',
    vote: 5639,
    score: '1.00000',
    entries: 3,
  },
  {
    rank: 3,
    name: 'cycuIM10944122',
    vote: 5550,
    score: '1.00000',
    entries: 1,
  },
  {
    rank: 4,
    name: 'Irvington',
    vote: 4545,
    score: '1.00000',
    entries: 5,
  },
  {
    rank: 5,
    name: '[Deleted] 3fc5036f-cdc5-4299-',
    vote: 3456,
    score: '1.00000',
    entries: 10,
  },
  {
    rank: 6,
    name: 'Daniel Simamora',
    vote: 456,
    score: '1.00000',
    entries: 1,
  },
  {
    rank: 7,
    name: 'yyybobo',
    vote: 400,
    score: '1.00000',
    entries: 1,
  },
  {
    rank: 8,
    name: 'fr1234',
    vote: 284,
    score: '1.00000',
    entries: 1,
  },
  {
    rank: 9,
    name: 'JuheeGJ',
    vote: 245,
    score: '1.00000',
    entries: 1,
  },
  {
    rank: 10,
    name: 'haoshuang666',
    vote: 222,
    score: '1.00000',
    entries: 1,
  },
  {
    rank: 11,
    name: 'Aman Singh #12',
    vote: 221,
    score: '1.00000',
    entries: 1,
  },
];
const DataDetailScreen = (props) => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTab = (obj) => {
    setTabIndex(obj.value);
  };
  useEffect(() => {
    console.log(12121);
  }, []);
  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.left}>
            <h3>RSNA-MICCAI Brain Tumor Radiogenomic Classification</h3>
            <p className={styles.leftP}>
              Predict the status of a genetic biomarker important for brain
              cancer treatment
            </p>
            <div className={styles.desc}>
              <img className={styles.descImg} src={d1} />
              <span>Radiological Society of North America · 2,086 teams · a month to
              go (a month to go until merger deadline)</span>
            </div>
          </div>
          <div className={styles.right}>
            <span className={styles.prize}>Prize Money</span>
            <span className={styles.sum}>$100,000</span>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.tabs}>
            <div className={styles.tabNav}>
              {tabs.map((obj) => (
                <span
                  key={obj.value}
                  onClick={() => handleTab(obj)}
                  className={`${styles.tabSty} ${
                    tabIndex === obj.value && styles.tabActive
                  }`}
                >
                  {obj.label}
                </span>
              ))}
            </div>
            <div className={styles.share}>
              <div className={styles.shareBtn}>
                <img src={share} className={styles.shareImg} />
                share
              </div>
              <div className={styles.applyBtn}>APPLY GRANT</div>
            </div>
          </div>
          <div className={styles.detailMain}>
            {tabIndex === 0 && (
              <div className={styles.descBox}>
                <div className={styles.title}>Description</div>
                <div className={styles.text}>
                  A malignant tumor in the brain is a life-threatening
                  condition. Known as glioblastoma, it's both the most common
                  form of brain cancer in adults and the one with the worst
                  prognosis, with median survival being less than a year. The
                  presence of a specific genetic sequence in the tumor known as
                  MGMT promoter methylation has been shown to be a favorable
                  prognostic factor and a strong predictor of responsiveness to
                  chemotherapy.
                  <br />
                  <br />
                  Currently, genetic analysis of cancer requires surgery to
                  extract a tissue sample. Then it can take several weeks to
                  determine the genetic characterization of the tumor. Depending
                  upon the results and type of initial therapy chosen, a
                  subsequent surgery may be necessary. If an accurate method to
                  predict the genetics of the cancer through imaging (i.e.,
                  radiogenomics) alone could be developed, this would
                  potentially minimize the number of surgeries and refine the
                  type of therapy required.
                  <br />
                  <br />
                  The Radiological Society of North America (RSNA) has teamed up
                  with the Medical Image Computing and Computer Assisted
                  Intervention Society (the MICCAI Society) to improve diagnosis
                  and treatment planning for patients with glioblastoma. In this
                  competition you will predict the genetic subtype of
                  glioblastoma using MRI (magnetic resonance imaging) scans to
                  train and test your model to detect for the presence of MGMT
                  promoter methylation.
                  <br />
                  <br />
                  If successful, you'll help brain cancer patients receive less
                  invasive diagnoses and treatments. The introduction of new and
                  customized treatment strategies before surgery has the
                  potential to improve the management, survival, and prospects
                  of patients with brain cancer.
                </div>
                <div className={styles.title}>Timeline</div>
                <div className={styles.text}>
                  July 13, 2021 - Start Date.
                  <br />
                  <br />
                  October 8, 2021 - Entry Deadline. You must accept the
                  competition rules before this date in order to compete.
                  <br />
                  <br />
                  October 8, 2021 - Team Merger Deadline. This is the last day
                  participants may join or merge teams.
                  <br />
                  <br />
                  October 15, 2021 - Final Submission Deadline. October 25, 2021
                  - Winners’ Requirements Deadline.
                  <br />
                  <br />
                  This is the deadline for winners to submit to the host/Kaggle
                  their training code, video, method description.
                </div>
                <div className={styles.title}>Prizes</div>
                <div className={styles.text}>
                  1st Place - $25,000 2nd Place - $20,000 3rd Place - $15,000
                  4th Place - $10,000 5th - 10th Place - $5,000
                </div>
              </div>
            )}
            {tabIndex === 1 && (
              <div className={styles.dataBox}>
                <div className={styles.title}>Data Description</div>
                <div className={styles.text}>
                  The competition data is defined by three cohorts: Training,
                  Validation (Public), and Testing (Private). The “Training” and
                  the “Validation” cohorts are provided to the participants,
                  whereas the “Testing” cohort is kept hidden at all times,
                  during and after the competition.
                </div>
                <div className={styles.title}>Files</div>
                <div className={styles.text}>
                  train/ - folder containing the training files, with each
                  top-level folder representing a subject. NOTE: There are some
                  unexpected issues with the following three cases in the
                  training dataset, participants can exclude the cases during
                  training: [00109, 00123, 00709]. We have checked and confirmed
                  that the testing dataset is free from such issues.
                  <br />
                  <br />
                  train_labels.csv - file containing the target MGMT_value for
                  each subject in the training data (e.g. the presence of MGMT
                  promoter methylation)
                  <br />
                  <br />
                  test/ - the test files, which use the same structure as
                  train/; your task is to predict the MGMT_value for each
                  subject in the test data. NOTE: the total size of the rerun
                  test set (Public and Private) is ~5x the size of the Public
                  test set
                  <br />
                  <br />
                  sample_submission.csv - a sample submission file in the
                  correct format
                </div>
                <div className={styles.title}>Date Explorer</div>
                <div className={styles.dataTable}>
                  <ul className={styles.dataUl}>
                    <li className={styles.headerLi}>
                      <span className={styles.tableHeader}>
                        Document (Register before Downloading)
                      </span>
                      <span className={styles.tableHeader}>Format</span>
                      <span className={styles.tableHeader}>Download</span>
                    </li>
                    {dataTable.map((obj, i) => (
                      <li key={i} className={styles.mainLi}>
                        <span className={styles.tableHeader}>{obj.doc}</span>
                        <span className={styles.tableHeader}>{obj.size}</span>
                        <span className={styles.tableHeader}>
                          <img src={download} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {tabIndex === 2 && (
              <div className={styles.leader}>
                <ul className={styles.leaderUl}>
                  <li className={styles.leaderHeaderLi}>
                    <span>#</span>
                    <span>Team Name</span>
                    <span>Team Member</span>
                    <span>Votes</span>
                    <span>score</span>
                    <span>Entries</span>
                  </li>
                  {leaderData.map((obj) => (
                    <li key={obj.rank} className={styles.leaderLi}>
                      <span>{obj.rank}</span>
                      <span>{obj.name}</span>
                      <span>
                        <img className={styles.memberImg} src={m1} />
                        {obj.rank <= 3 && (
                          <img className={styles.memberImg} src={m2} />
                        )}
                      </span>
                      <span>{obj.vote}</span>
                      <span>{obj.score}</span>
                      <span>{obj.entries}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tabIndex === 3 && (
              <div>
                <div className={styles.title}>One account per participant</div>
                <div className={styles.text}>
                  You cannot sign up to Kaggle from multiple accounts and
                  therefore you cannot submit from multiple accounts.
                </div>
                <div className={styles.title}>
                  No private sharing outside teams
                </div>
                <div className={styles.text}>
                  Privately sharing code or data outside of teams is not
                  permitted. It's okay to share code if made available to all
                  participants on the forums.
                </div>

                <div className={styles.title}>Team Mergers</div>
                <div className={styles.text}>
                  Team mergers are allowed and can be performed by the team
                  leader. In order to merge, the combined team must have a total
                  submission count less than or equal to the maximum allowed as
                  of the merge date. The maximum allowed is the number of
                  submissions per day multiplied by the number of days the
                  competition has been running.
                </div>

                <div className={styles.title}>Team Limits</div>
                <div className={styles.text}>
                  There is no maximum team size.
                </div>

                <div className={styles.title}>Submission Limits</div>
                <div className={styles.text}>
                  You may submit a maximum of 10 entries per day.
                  <br />
                  You may select up to 5 final submissions for judging.
                </div>

                <div className={styles.title}>Competition Timeline</div>
                <div className={styles.text}>
                  Start Date: 9/28/2012 9:13 PM UTC
                  <br />
                  This is a fun competition aimed at helping you get started
                  with machine learning. While the Titanic dataset is publicly
                  available on the internet, looking up the answers defeats the
                  entire purpose. So seriously, don't do that.
                </div>
              </div>
            )}
            <div className={styles.shareBottom}>
              <div className={styles.shareBtn}>
                <img src={share} className={styles.shareImg} />
                share
              </div>
              <div className={styles.applyBtn}>APPLY GRANT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DataDetailScreen;
