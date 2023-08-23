import styles from "@/styles/user.module.css";

const { CLIENT_ID } = process.env;
const CALLBACK = "http://localhost:3000/api/auth/callback";

const URL = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${CALLBACK}&response_type=code&approval_prompt=force&scope=activity:read`;

export default (): JSX.Element => {
  return (
    <a href={URL} referrerPolicy="no-referrer">
      <div className={styles.connect} />
    </a>
  );
};
