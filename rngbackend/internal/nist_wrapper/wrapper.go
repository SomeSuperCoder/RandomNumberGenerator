package nistwrapper

import "github.com/SomeSuperCoder/RandomNumberGenerator/nist80022"

type TestResult struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Result      bool   `json:"result"`
}

type TestFunc = func(bitArray *nist80022.BitArray) *TestResult

func RunTests(bitArray *nist80022.BitArray, tests []TestFunc) []*TestResult {
	var result []*TestResult

	for _, test := range tests {
		result = append(result, test(bitArray))
	}

	return result
}
