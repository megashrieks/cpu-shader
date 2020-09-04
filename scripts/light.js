const calculateLight = (pos,d,dir,normal,index,depth) => {
    let materialColor = color[index];
    let specStrength = .35;
    let diffuseColor = [0, 0, 0];
    let specularColor = [0, 0, 0];
    let ambient = 0;
    let viewDir = mulscalar(dir, -1);
    let point = [pos[0] + (d - e) * dir[0], pos[1] + (d - e) * dir[1], pos[2] + (d - e) * dir[2]];
    let ambientColor,
        spp = 2,
        count = 0,
        directLight = [0, 0, 0],
        indirectLight = [0, 0, 0];
    if (PHONG || EMISSIVE) {
        for (let j = 0; j < spp; ++j) {
            let lightDirection = hem(Math.random(), Math.random(), normal)
            // let lightDirection = boxRand(1,normal)
            let [_, lightColor, mat] = rayCast(point, lightDirection, depth-1);
            if (PHONG && (mat == -1 || materials[mat] == 3)) {
                let currentDiffuse = min(max(dot(lightDirection, normal), 0), 1);
                diffuseColor = addvector(diffuseColor, mulscalar(lightColor, currentDiffuse))
                let reflectDir = reflect(mulscalar(lightDirection, -1), normal);
                let currentSpecular = (max(dot(viewDir, reflectDir), 0) ** 32) * specStrength;
                specularColor = addvector(specularColor, mulscalar(lightColor, currentSpecular));
                ++count;
            }

            if (EMISSIVE) {
                // let lightDirection = hem(Math.random(), Math.random(), normal)
                // let [_, lightColor, mat] = rayCast(point, lightDirection, depth - 1);
                indirectLight = addvector(indirectLight, mulscalar(lightColor, 2 * dot(lightDirection, normal)));
                indirectLight = mulscalar(indirectLight, 1 / spp);
            }
        }
        if (PHONG) {
            ambientColor = mulscalar(materialColor, ambient);
            directLight = addvector(ambientColor, addvector(diffuseColor, specularColor));
            directLight = mulscalar(directLight, 1 / spp);
        }
    }
    let totalLight = addvector(directLight, indirectLight);
    materialColor = mulvector(materialColor, totalLight);
    return materialColor;
}