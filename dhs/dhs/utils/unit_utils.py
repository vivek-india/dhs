class UnitUtils(object):
    def __init__(self, unitRelationship):
        if "=" not in unitRelationship:
            raise ValueError("Invalid Unit Relationship. Supported format: "
                             "Example: 30 Kg = 1 Bori")

        unitRelationship = " ".join(unitRelationship.split())

        self._unitRelationship = unitRelationship


        units = unitRelationship.split("=")

        units[0] = " ".join(units[0].split())
        units[1] = " ".join(units[1].split())


        unitA = units[0].split(' ')
        unitB = units[1].split(' ')

        if ((len(unitA) != 2) or len(unitB) != 2):
            raise ValueError("Invalid Unit Relationship. Supported format: "
                             "Example: 30 Kg = 1 Bori")

        unitA = [int(unitA[0]), unitA[1].upper()]
        unitB = [int(unitB[0]), unitB[1].upper()]

        # NOTE: self.unitA will be smaller unit
        if unitA[0] > unitB[0]:
            self._unitA = unitA
            self._unitB = unitB
        else:
            self._unitA = unitB
            self._unitB = unitA

    def normalizeSingle(self, val):

        if val[1] == self._unitB[1]:
                return (str(val[0]) + " " + val[1])
        else:
            if val[0] < self._unitA[0]:
                return (str(val[0]) + " " + val[1])

            else:
                q = val[0] / self._unitA[0]
                r = val[0] % self._unitA[0]
                if r <= 0:
                    ret = str(q) + " " + self._unitB[1]
                else:
                    ret = str(q) + " " + self._unitB[1] + \
                          " " + str(r) + " " + self._unitA[1]

                return ret

        raise ValueError("Invalid Input: {}".format(val))


    def normalize(self, val):
        val = " ".join(val.split())
        val = val.split()

        if len(val) == 2:
            val = [int(val[0]), val[1].upper()]

            # Check if units are valid
            if (val[1] != self._unitA[1]) and (val[1] != self._unitB[1]):
                raise ValueError("Invalid Input: {}".format(val))

            return self.normalizeSingle(val)
        elif len(val) == 4:
            val = [int(val[0]), val[1].upper(), int(val[2]), val[3].upper()]

            # Check if units are valid
            if (val[3] != self._unitA[1]) and (val[3] != self._unitB[1]):
                raise ValueError("Invalid Input: {}".format(val))

            if val[1] == val[3]:
                val[0] += val[2];
                return self.normalizeSingle(val)

            if val[1] == self._unitA[1]:
                val[0], val[2] = val[2], val[0]
                val[1], val[3] = val[3], val[1]

            if val[1] == self._unitB[1]:
                tmp_val = [val[2], val[3]]
                tmp_result = self.normalizeSingle(tmp_val)
                tmp_result = tmp_result.split(' ')

                if len(tmp_result) == 2:
                    if val[1] == tmp_result[1]:
                        val[0] += int(tmp_result[0])
                        ret = str(val[0]) + " " + val[1]
                    else:
                        ret = str(val[0]) + " " + val[1] + " " + \
                              tmp_result[0] + " " + tmp_result[1]
                    return ret;
                else:
                    val[0] += int(tmp_result[0])
                    ret = str(val[0]) + " " + val[1] + " " + \
                          str(tmp_result[2]) + " " + tmp_result[3]
                    return ret;

        raise ValueError("Invalid Input: {}".format(val))

    def subtractSingle(self, fromVal, val):
        if fromVal[1] == val[1]: #  Same Unit
            ret = str(fromVal[0] - val[0]) + " " + val[1]
            ret = self.normalize(ret)
            return ret
        else:
            # If 'fromVal' is smaller unit and 'val' is bigger unit
            if (fromVal[1] == self._unitA[1]):
                fromVal[0] -= (self._unitA[0] * val[0])
                ret = self.normalize(str(fromVal[0]) + " " + fromVal[1])
                return ret
            else:
                # If 'fromVal' is bigger unit and 'val' is smaller unit
                fromVal[0] = (self._unitA[0] * fromVal[0]) - val[0]
                ret = self.normalize(str(fromVal[0]) + " " + self._unitA[1])
                return ret

    def subtract(self, fromVal, val):

        fromVal = self.normalize(fromVal)
        fromVal = fromVal.split(" ")

        val = self.normalize(val)
        val = val.split(" ")

        if (len(fromVal) == 2 and len(val) == 2):
            fromVal = [int(fromVal[0]), fromVal[1]]
            val = [int(val[0]), val[1]]

            return self.subtractSingle(fromVal, val)
        elif (len(fromVal) == 4 and len(val) == 2):
            fromVal = [int(fromVal[0]), fromVal[1], int(fromVal[2]), fromVal[3]]
            val = [int(val[0]), val[1]];

            #  Convert 'fromVal's into smaller unit
            fromVal[0] = fromVal[0] * self._unitA[0] + fromVal[2]
            fromVal[1] = fromVal[3]
            
            # Convert 'val's into smaller unit
            if (val[1] == self._unitB[1]):
                val[0] *= self._unitA[0]
                val[1] = self._unitA[1]

            return self.subtractSingle(fromVal, val)
        elif len(fromVal) == 2 and len(val) == 4:
            fromVal = [int(fromVal[0]), fromVal[1]]
            val = [int(val[0]), val[1], int(val[2]), val[3]]

            # Conver 'val's into smaller unit
            val[0] = val[0] * self._unitA[0] + val[2]
            val[1] = val[3]

            # Conver 'fromVal's into smaller unit
            if (fromVal[1] == self._unitB[1]):
                fromVal[0] *= self._unitA[0]
                fromVal[1] = self._unitA[1]

            return self.subtractSingle(fromVal, val)
        elif (len(fromVal) == 4 and len(val) == 4):
            fromVal = [int(fromVal[0]), fromVal[1], int(fromVal[2]), fromVal[3]]
            val = [int(val[0]), val[1], int(val[2]), val[3]]

            # Conver 'fromVal's into smaller unit
            fromVal[0] = fromVal[0] * self._unitA[0] + fromVal[2]
            fromVal[1] = fromVal[3]

            # Conver 'val's into smaller unit
            val[0] = val[0] * self._unitA[0] + val[2]
            val[1] = val[3]
            
            return self.subtractSingle(fromVal, val)




if __name__ == "__main__":
    
    obj = UnitUtils("30 Kg =          1 Bori")
    # print obj.normalize("450 bori")
    # print obj.normalize("20 bori")           # ret 20 bori
    # print obj.normalize("10 kg")             # ret 10 kg
    # print obj.normalize("300 Kg")            # ret 10 bori
    # print obj.normalize("310 Kg")            #ret 10 bori 10 kg
    # print obj.normalize("20 bori 10 kg")     #ret 20 bori 10 kg
    # print obj.normalize("20 bori 310 kg")    # ret 30 bori 10 kg
    # print obj.normalize("300 kg 20 bori")    #ret 30 bori 10 kg
    # print obj.normalize("310 kg 20 bori")    #ret 30 bori 10 kg
    # print obj.normalize("30 kg 20 kg")       #ret 30 bori 10 kg
    # print obj.normalize("30 bori 20 bori")   # ret 30 bori 10 kg



    # print obj.subtract("30 bori", "20 bori")
    # print obj.subtract("20 Bori", "10 Kg")
    # print obj.subtract("300 Kg", "9 Bori")
    # print obj.subtract("300 Kg", "280 kg")
    # print obj.subtract("10 bori", "180 kg")


    # print obj.subtract("10 Bori 20 Kg", "10 Bori")
    # print obj.subtract("10 Bori 40 Kg", "10 Bori 10 kg")
