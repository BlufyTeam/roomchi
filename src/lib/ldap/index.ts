import ldap from "ldapjs";

export function ldapSearch(domainName, domainController, loginName, password) {
  const serverUrl = `ldap://${domainController}`;

  const bindDN = loginName;
  const bindPassword = password;
  const userSearchBase = `OU=Rouginedarou,OU=Client Users,DC=${domainName},DC=com`;

  const client = ldap.createClient({
    url: serverUrl,
  });

  const searchOptions = {
    filter: "(objectClass=user)", // Customize the filter based on your needs
    scope: "sub",
    attributes: ["displayName", "mail", "sAMAccountName"],
  };

  return new Promise((resolve, reject) => {
    client.bind(bindDN, bindPassword, (error) => {
      if (error) {
        console.error("Failed to bind:", error);
        reject(error);
        return;
      }

      console.log("Successfully connected to the Active Directory");

      const users = []; // Initialize an empty array to store the users

      client.search(
        userSearchBase,
        searchOptions,
        (searchError, searchResponse) => {
          if (searchError) {
            console.log("Search failed: ", searchError);
            reject(searchError);
            return;
          }

          searchResponse.on("searchEntry", (entry) => {
            const attributes = entry.attributes;
            let user = {};

            attributes.forEach((attribute) => {
              const values = Array.isArray(attribute.values)
                ? attribute.values
                : [attribute.values];
              user[attribute.type] = values.join(", "); // Collect the attributes as a user object
            });

            users.push(user); // Add the user to the users array
          });

          searchResponse.on("error", (error) => {
            console.log("Search Error: ", error);
            reject(error);
          });

          searchResponse.on("end", () => {
            client.unbind(() => {
              console.log("Disconnected from Active Directory");
              resolve(users); // Return the list of users
            });
          });
        }
      );
    });
  });
}

export function verifyUserPassword(
  domainName,
  domainController,
  loginName,
  password,
  username,
  userPassword
) {
  const serverUrl = `ldap://${domainController}`;

  const bindDN = loginName;
  const bindPassword = password;
  const userSearchBase = `OU=Rouginedarou,OU=Client Users,DC=${domainName},DC=com`;

  const client = ldap.createClient({
    url: serverUrl,
  });

  const searchOptions = {
    filter: `(sAMAccountName=${username})`, // Use the provided username for the filter
    scope: "sub",
    attributes: ["displayName", "sAMAccountName"],
  };

  try {
    // Bind to the LDAP server
    client.bindSync(bindDN, bindPassword);
    console.log("Successfully connected to the Active Directory");

    const searchResponse = client.searchSync(userSearchBase, searchOptions);
    let userExists = false;

    // Check for user in search results
    for (const entry of searchResponse.entries) {
      const attributes = entry.attributes;
      const sAMAccountNameAttribute = attributes.find(
        (attribute) => attribute.type === "sAMAccountName"
      );

      let userDN = null;
      if (sAMAccountNameAttribute) {
        const values = Array.isArray(sAMAccountNameAttribute.values)
          ? sAMAccountNameAttribute.values
          : [sAMAccountNameAttribute.values];
        userDN = values.join(", ");
      }

      if (userDN) {
        userExists = true;
        try {
          client.bindSync(userDN, userPassword);
          console.log("User authenticated successfully");
          client.unbind();
          return true; // Password correct
        } catch (bindError) {
          console.log("Incorrect password");
          client.unbind();
          return false; // Incorrect password
        }
      }
    }

    if (!userExists) {
      console.log("User does not exist");
      client.unbind();
      return false; // User not found
    }
  } catch (error) {
    console.error("Error:", error);
    client.unbind();
    return false; // Error occurred
  }
}

type TreeViewEntry = {
  dn: string;
  ou?: string;
};

async function getTreeView(
  domainName: string,
  domainController: string,
  loginName: string,
  password: string
): Promise<string[]> {
  const serverUrl = `ldap://${domainController}`;
  const bindDN = loginName;
  const bindPassword = password;

  const client = ldap.createClient({
    url: serverUrl,
  });

  const searchOptions = {
    filter: "(objectClass=organizationalUnit)", // Search for OUs
    scope: "sub", // Search all sub-levels
    attributes: ["dn", "ou"], // Only retrieve the DN and OU attributes
  };

  const entriesList: string[] = [];

  // Recursive function to print the tree view as a list of strings
  function printTree(entries: TreeViewEntry[], level: number = 0) {
    entries.forEach((entry) => {
      // Indentation based on the level
      const indent = " ".repeat(level * 2);
      entriesList.push(`${indent}${entry.dn}`);
      if (entry.ou) {
        entriesList.push(`${indent}  OU: ${entry.ou}`);
      }
    });
  }

  return new Promise((resolve, reject) => {
    client.bind(bindDN, bindPassword, (error) => {
      if (error) {
        console.error("Failed to bind:", error);
        reject(error);
        return;
      }

      client.search(`DC=${domainName},DC=com`, searchOptions, (err, res) => {
        if (err) {
          reject("Search failed");
          return;
        }

        const entries: TreeViewEntry[] = [];
        res.on("searchEntry", (entry) => {
          entries.push({
            dn: entry.dn,
            ou: entry.attributes?.ou?.[0] ?? undefined, // Safely handle the OU attribute
          });
        });

        res.on("end", () => {
          printTree(entries); // Add tree to the list
          client.unbind();
          resolve(entriesList); // Return the list of strings
        });

        res.on("error", (error) => {
          reject(`Search error: ${error}`);
          client.unbind();
        });
      });
    });
  });
}

// Example usage
// getTreeView("RougineDarou", "192.168.100.11", "helpdesk", "ani4N6-u}jxY")
//   .then((tree) => {
//     console.log(tree); // This will output the list of strings
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });

// getTreeView("RougineDarou", "192.168.100.11", "helpdesk", "ani4N6-u}jxY");
