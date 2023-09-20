package csvsql

import (
	"fmt"
	"github.com/bujupah/excel/pkg/src/constants"
	"os"
)

func CreateSpace(tenantId int64) (string, bool, error) {
	dbPath := fmt.Sprintf("./%v-%v", constants.ParentFolder, tenantId) // Change this to your desired folder path
	_, err := os.Stat(dbPath)
	if err != nil {
		if os.IsNotExist(err) {
			if err := os.MkdirAll(dbPath, os.ModePerm); err != nil {
				return "", false, err
			}
			fmt.Println("Space is created on", dbPath)
			return dbPath, true, nil
		} else {
			fmt.Println("Error while checking if space exists", err)
			return "", false, err
		}
	}
	fmt.Println("Existing space is used on", dbPath)
	return dbPath, false, nil
}
