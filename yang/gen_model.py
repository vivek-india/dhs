from yang import product


if __name__ == "__main__":
    p = product.product()
    import pdb; pdb.set_trace()
    #for k,v in p._pyangbind_elements.iteritems():
    #    attr = getattr(p, '__' + k)
    #    print attr
    for prop in p:
        # print prop[0], prop[1]._yang_type
        if prop[1]._yang_type == 'string'
        elif prop[1]._yang_type == 'uint8'
        elif prop[1]._yang_type == 'uint32'
        elif prop[1]._yang_type == 'container'
