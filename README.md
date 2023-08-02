![fast_flicks logo](/logo.png)

# Fast⎵Flicks - Improve Your 10 Fingers Typing Speed

## Description

This is a Typing Test Application designed to help users improve their 10 fingers typing speed and accuracy. The application allows users to practice typing different texts and measures their typing speed in words per minute (WPM) and accuracy.

## Technologies Used

- **Typescript:** The entire project is developed using TypeScript, which adds static typing and enhances code quality.
- **SST (Serverless Stack):** The application is deployed on AWS using the Serverless Stack framework, enabling serverless architecture for scalability and cost-effectiveness.
- **Next.js:** The frontend is built using Next.js, a popular React framework that enables server-side rendering and other advanced features.
- **Zustand:** Zustand is used for state management, providing a simple and efficient way to manage application state.
- **Supabase:** Supabase is used as the backend and database, providing real-time and scalable data storage.
- **Prisma:** Prisma is used as an ORM (Object-Relational Mapping) tool to interact with the database seamlessly.
- **shadcn/ui:** This library of components based on Radix UI is used for building a consistent and visually appealing user interface.
- **react-hook-forms:** react-hook-forms is utilized for handling form validation and user input.
- **zod:** zod is used for data validation, ensuring that the input data meets the required schema.
- **TailwindCSS:** TailwindCSS is used as the CSS framework, enabling rapid UI development with utility classes.

## Setup and Deployment

To run and deploy the project, follow the steps below:

1. Clone the repository to your local machine.

2. Install the required dependencies using npm or yarn:

```
npm install
```

3. Configure `sst.config.ts` with your AWS credentials and other deployment settings.

4. Run the application locally:

```
npm run dev
```

5. To deploy the application to AWS:

```
[Check SST documentation](https://docs.sst.dev/)
```

Ensure that you have the necessary permissions and AWS CLI configured for deployment.

## How to Use

1. Access the application through the deployed URL or locally at `http://localhost:3000`.

2. log in to your account using Supabase authentication.

3. Start the typing test by selecting the desired text passage or entering your own.

4. Begin typing the provided text as accurately and quickly as possible.

5. The application will calculate your typing speed (WPM) and accuracy, providing feedback on your performance.

6. Practice regularly to improve your typing speed and accuracy!


## License
Copyright 2023 Fast_Flicks

Licensed under the Apache License, Version 2.0 (the "[License](/LICENSE)");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.