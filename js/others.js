var keycloak = new Keycloak();


function initKeycloak() {
    keycloak.init({onLoad: 'login-required'}).then(function() {
        console.log("Authenticated");
    }).catch(function() {
        alert('failed to initialize');
    });
}


async function keycloakLogin() {
    try {
      // Initialize Keycloak and handle the authentication
      const auth = await keycloak.init({
        onLoad: "login-required",
      });

      //If not authenticated then reload to show login page
      if (!auth) {
        window.location.reload();
      } else {
        console.log("User is authenticated");
      }
  
      //If token is present then store it in localstorage
      if (keycloak.token) {
        window.localStorage.setItem("keycloakToken", keycloak.token);
        window.localStorage.setItem("idToken", keycloak.idToken);
      }
  
      // Call the setupTokenChecking function to initiate token checking
      setupTokenChecking();
    } catch (error) {
      console.error("Error initializing Keycloak:", error);
    }
  }
  
async function keycloakLogout() {
    const logoutURL = "http://localhost:3000/html/logout.html";
  
    keycloak
      .logout({ redirectUri: logoutURL })
      .then((success) => {
        console.log("User logout success ", success);
      })
      .catch((error) => {
        console.log("User logout error ", error);
      });
  }

  async function setupTokenChecking() {
    await checkAndRenewToken(); // Check the token immediately upon setup
    const tokenCheckInterval = 5 * 60 * 1000; // periodic token checks for 5 minutes in milliseconds
    setInterval(checkAndRenewToken, tokenCheckInterval);
  }
  
  // Function to periodically check and renew the Keycloak token
  async function checkAndRenewToken() {
    try {
      if (keycloak.isTokenExpired()) {
        console.log("Token is expired. Renewing token...");
        try {
          await keycloak.updateToken(60);
        } catch (error) {
          console.error(
            "Refresh Token Failed : " + JSON.stringify(error, null, 4)
          );
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error checking/renewing token:", error);
    }
  }