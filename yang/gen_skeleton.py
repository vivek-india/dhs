import sys
import subprocess
import xmltodict
import json



def execute(cmd):
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    output = process.communicate()[0]
    exitcode = process.returncode

    if (exitcode == 0):
        return output
    else:
        raise ProcessException(cmd, exitcode, output)

def generate_yin(filename):
    cmd = "pyang -f yin " + filename
    cmd = cmd.split()

    return execute(cmd)


if __name__ == "__main__":

    output = generate_yin(sys.argv[1])
    doc = xmltodict.parse(output)
    print json.dumps(doc)
