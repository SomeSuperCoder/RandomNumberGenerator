package nistwrapper

import "github.com/SomeSuperCoder/RandomNumberGenerator/nist80022"

func SumsTest(bitArray *nist80022.BitArray) *TestResult {
	const name = "Тест кумулятивных сумм"
	const desc = "Проверяет, не накапливается ли перевес нулей или единиц в какой-то части последовательности. В случайных данных сумма не должна слишком сильно отклоняться от нуля"

	_, result := nist80022.CumulativeSumsTest(bitArray)

	return &TestResult{
		Name:        name,
		Description: desc,
		Result:      result,
	}
}
