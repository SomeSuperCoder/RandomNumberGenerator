package nistwrapper

import "github.com/SomeSuperCoder/RandomNumberGenerator/nist80022"

func LongestOnesTest(bitArray *nist80022.BitArray) *TestResult {
	const name = "Тест самой длинной серии единиц"
	const desc = "Проверяет, нет ли в последовательности подозрительно длинных непрерывных цепочек из единиц, что может указывать на неслучайность данных"

	_, result := nist80022.LongestRunOfOnesTest(bitArray)

	return &TestResult{
		Name:        name,
		Description: desc,
		Result:      result,
	}
}
