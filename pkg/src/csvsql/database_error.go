package csvsql

import (
	"errors"
	"fmt"
	"github.com/mithrandie/csvq/lib/query"
)

func NewError(message string, err error) error {
	var queryErr query.Error
	if errors.As(err, &queryErr) {
		return fmt.Errorf("%s: error code:%d, number:%d, line:%d, char:%d, message:%s\n",
			message,
			queryErr.Code(),
			queryErr.Number(),
			queryErr.Line(),
			queryErr.Char(),
			queryErr.Message(),
		)
	} else {
		return fmt.Errorf("%s: %s", message, err.Error())
	}
}
