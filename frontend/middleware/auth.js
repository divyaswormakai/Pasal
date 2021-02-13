export default function ({ $auth }) {
  if (!$auth.loggedIn) {
    console.log('Go wawy')
    // return redirect('/test')
  }
}
