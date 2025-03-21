import { cookies } from 'next/headers';

import WhiteBox from '../material/white-box';
import Widget from '../material/widget';

export default async function PrivacyScore() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;

  if (!sessionCookie) {
    return <p>Unauthorized</p>;
  }

  const responseACS = await fetch(
    'http://localhost:3001/api/assets-count-sum',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const responseGACS = await fetch(
    'http://localhost:3001/api/granted-assets-count-sum',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const responseRRC = await fetch(
    'http://localhost:3001/api/recent-revokes-count',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const responseRBC = await fetch(
    'http://localhost:3001/api/recent-breaches-count',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );
  const responseUME = await fetch(
    'http://localhost:3001/api/user-mfa-enabled',
    {
      method: 'GET',
      credentials: 'include',
      headers: { Cookie: `connect.sid=${sessionCookie}` },
    },
  );

  if (
    responseACS.status === 200 &&
    responseGACS.status === 200 &&
    responseRRC.status === 200 &&
    responseRBC.status === 200 &&
    responseUME.status === 200
  ) {
    const dataASC = await responseACS.json();
    const assetsCount: number = Number(dataASC[0].count);
    const assetsSum: number = Number(dataASC[0].sum);

    const dataGASC = await responseGACS.json();
    const grantedAssetsCount: number = Number(dataGASC[0].count);
    const grantedAssetsSum: number = Number(dataGASC[0].sum);

    const dataRRC = await responseRRC.json();
    const recentRevokesCount: number = Number(dataRRC[0].revoke_count);

    const dataRBC = await responseRBC.json();
    const recentBreachesCount: number = Number(dataRBC[0].breach_count);

    const dataUME = await responseUME.json();
    const userMfaEnabled: number = dataUME[0].mfa_enabled;
    const mfa_factor: number = userMfaEnabled ? 1 : 0;

    const permissionsFactor: number = 1 - grantedAssetsCount / assetsCount;
    const sensitivityFactor: number = 1 - grantedAssetsSum / assetsSum;
    const recentActivityFactor: number =
      Math.min(recentRevokesCount * 5, 20) / 20;
    const breachFactor: number = 1 - Math.min(recentBreachesCount * 5, 20) / 20;

    const privacyScore: number = Math.floor(
      (0.3 * permissionsFactor +
        0.2 * sensitivityFactor +
        0.2 * recentActivityFactor +
        0.2 * breachFactor +
        0.1 * mfa_factor) *
        100,
    );

    const getProgressColor = (score: number): string => {
      if (score >= 80) return '#16a34a';
      if (score >= 50) return '#f59e0b';
      return '#dc2626';
    };

    const getCircleColor = (score: number): string => {
      if (score >= 80) return '#bbf7d0';
      if (score >= 50) return '#fde68a';
      return '#fecaca';
    };

    const progressColor = getProgressColor(privacyScore);
    const CircleColor = getCircleColor(privacyScore);

    const tips = [];

    if (permissionsFactor < 0.7) {
      tips.push('Revoke unnecessary permissions to improve your privacy.');
    }
    if (!userMfaEnabled) {
      tips.push('Enable two-factor authentication for extra security.');
    }
    if (recentBreachesCount > 0) {
      tips.push('Review your account security after recent data breaches.');
    }
    if (sensitivityFactor < 0.7) {
      tips.push('Minimize sharing sensitive data with services.');
    }
    if (tips.length === 0) {
      tips.push('Great job! Keep maintaining your strong privacy practices.');
    }

    return (
      <Widget title="Privacy Score">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="relative w-1/3 max-w-xs">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke={CircleColor}
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                strokeWidth="3"
                strokeDasharray={`${privacyScore}, 100`}
                strokeDashoffset="0"
                stroke={progressColor}
              />
            </svg>
            <div
              className={`absolute inset-0 flex items-center justify-center text-2xl font-semibold`}
              style={{ color: progressColor }}
            >
              {privacyScore}%
            </div>
          </div>

          <div className="flex-1">
            <p className="text-gray-800 text-lg font-medium">
              Your Privacy Score
            </p>
            <p className="text-gray-600 text-sm mb-4">
              {privacyScore > 80
                ? "You're doing great! Keep it up."
                : 'Review permissions to improve your privacy.'}
            </p>
            <WhiteBox className="p-4 space-y-2">
              <p className="text-gray-700 text-sm font-medium">Privacy Tips:</p>
              <ul className="list-disc list-inside text-gray-500 text-sm">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </WhiteBox>
          </div>
        </div>
      </Widget>
    );
  }
}
