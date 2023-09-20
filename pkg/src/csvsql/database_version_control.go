package csvsql

import (
	"fmt"
	"github.com/bujupah/excel/pkg/src/constants"
	"os"
	"strings"
)

func VerifyVersion(tenantId int64, dbName string, dbVersion string) (bool, string, error) {
	dbName = strings.ReplaceAll(dbName, " ", "_")
	versionPath := fmt.Sprintf("./%v-%v/%v.version", constants.ParentFolder, tenantId, dbName)

	fmt.Println("Checking version on", versionPath)

	if _, err := os.Stat(versionPath); err != nil {
		if err := WriteVersion(tenantId, dbName, dbVersion); err != nil {
			fmt.Printf("Error writing version: %v\n", err)
			return false, dbVersion, err
		}
		fmt.Println("Updated database to a new version")
		return true, dbVersion, nil
	}

	fmt.Println("Found an existing database version")
	bytes, err := os.ReadFile(versionPath)
	if err != nil {
		return false, "", err
	}

	fmt.Println("Comparing database version with datasource version")
	localVersion := string(bytes)
	shouldUpdate := dbVersion != localVersion

	if shouldUpdate {
		if err := WriteVersion(tenantId, dbName, dbVersion); err != nil {
			fmt.Println("Failed to update database", err)
			return false, dbVersion, err
		}
	}

	return shouldUpdate, localVersion, nil
}

func WriteVersion(tenantId int64, dbName string, version string) error {
	dbName = strings.ReplaceAll(dbName, " ", "_")

	versionPath := fmt.Sprintf("./%v-%v/%v.version", constants.ParentFolder, tenantId, dbName)

	fmt.Printf("Writing version v%v to %v\n", version, versionPath)

	_ = os.Remove(versionPath)

	return os.WriteFile(versionPath, []byte(version), os.ModePerm)
}
