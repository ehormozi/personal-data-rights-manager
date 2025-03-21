'use client';

import Widget from '@/components/server/widget';
import WhiteBox from '@/components/server/white-box';

export default function AccountInformationClient(props: {
  first_name: string;
  last_name: string;
  email: string;
}) {
  const handleUpdate = () => {
    console.log('Updated User Data:', props.email);
  };

  return (
    <Widget title="Account Information">
      <WhiteBox className="p-4 space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">First Name:</span>
          <input
            type="text"
            name="firstName"
            defaultValue={props.first_name}
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">Last Name:</span>
          <input
            type="text"
            name="lastName"
            defaultValue={props.last_name}
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">Email:</span>
          <input
            type="email"
            name="email"
            defaultValue={props.email}
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </label>
        <button
          onClick={handleUpdate}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
        >
          Update Profile
        </button>
      </WhiteBox>
    </Widget>
  );
}
